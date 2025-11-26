type KisTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  access_token_token_expired: string;
};

type KisApprovalResponse = {
  approval_key: string;
};

export async function getKisAccessToken() {
  const res = await fetch('/api/kis/token', {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS token fetch failed: ${text}`);
  }

  const data = (await res.json()) as KisTokenResponse;
  return data;
}

export async function getKisApprovalKey() {
  const res = await fetch('/api/kis/approval', {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS approval fetch failed: ${text}`);
  }

  return (await res.json()) as KisApprovalResponse;
}
