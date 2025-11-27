'use client';

type KisApprovalResponse = {
  approval_key: string;
};

async function getKisApprovalKey() {
  const res = await fetch('/api/kis/approval', {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS approval fetch failed: ${text}`);
  }

  return (await res.json()) as KisApprovalResponse;
}

export class KisWebsocketClient {
  private ws: WebSocket | null = null;
  private approvalKey: string | null = null;

  constructor(private url: string) {}

  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // 1)웹소켓 연결 전 approvalKey 발급
    const { approval_key } = await getKisApprovalKey();
    this.approvalKey = approval_key;
    console.log('KIS approval key:', this.approvalKey);

    // 2)웹소켓 연결 시작
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('KIS WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      console.log('KIS WebSocket message:', event.data);
    };

    this.ws.onerror = (event) => {
      console.error('KIS WebSocket error:', event);
    };

    this.ws.onclose = (event) => {
      console.log('KIS WebSocket closed:', event.code, event.reason);
      this.ws = null;
    };
  }

  disconnect() {
    if (!this.ws) return;
    this.ws.close();
    this.ws = null;
  }
}
