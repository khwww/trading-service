"use client";

type KISApprovalResponse = {
  approval_key: string;
};

async function getKISApprovalKey() {
  const res = await fetch("/api/kis/approval", {
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS approval fetch failed: ${text}`);
  }

  return (await res.json()) as KISApprovalResponse;
}

export class KISWebsocketClient {
  private ws: WebSocket | null = null;
  private approvalKey: string | null = null;

  private messageListeners = new Set<(data: string) => void>();
  private sendQueue: string[] = [];

  constructor(private url: string) {}

  getApprovalKey() {
    return this.approvalKey;
  }

  /** 연결 상태 확인 */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /** 메시지 리스너 등록 */
  addMessageListener(listener: (data: string) => void) {
    this.messageListeners.add(listener);
  }

  /** 메시지 리스너 해제 */
  removeMessageListener(listener: (data: string) => void) {
    this.messageListeners.delete(listener);
  }

  /** 메시지 전송 (연결 전이면 큐에 저장) */
  send(data: string) {
    if (this.isConnected()) {
      this.ws!.send(data);
    } else {
      this.sendQueue.push(data);
    }
  }

  /** 큐에 있는 메시지들을 전송 */
  private flushSendQueue() {
    if (!this.isConnected() || this.sendQueue.length === 0) return;

    const queue = [...this.sendQueue];
    this.sendQueue = [];

    queue.forEach((msg) => {
      if (this.isConnected()) {
        this.ws!.send(msg);
      } else {
        // 연결이 끊어졌으면 다시 큐에 넣음
        this.sendQueue.push(msg);
      }
    });
  }

  /** 연결 */
  async connect() {
    if (this.isConnected()) {
      // console.log('WebSocket already connected');
      return;
    }

    const { approval_key } = await getKISApprovalKey();
    this.approvalKey = approval_key;
    console.log("KIS approval key:", this.approvalKey);

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("KIS WebSocket connected");
      // 큐에 있는 메시지들을 안전하게 전송
      this.flushSendQueue();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      // 등록된 모든 리스너들에게 raw 데이터 전달
      const data = String(event.data);
      for (const listener of this.messageListeners) {
        listener(data);
      }
    };

    this.ws.onerror = (event) => {
      console.error("KIS WebSocket error:", event);
    };

    this.ws.onclose = (event) => {
      console.log("KIS WebSocket closed:", event.code, event.reason);
      this.ws = null;
    };
  }

  /** 연결 종료 */
  disconnect() {
    if (!this.ws) return;
    this.ws.close();
    this.ws = null;
  }
}
