export interface Web3FormsPayload {
  name?: string
  email?: string
  subject?: string
  message?: string
  [key: string]: unknown
}

export interface Web3FormsResult {
  success: boolean
  message?: string
}

export async function submitToWeb3Forms(payload: Web3FormsPayload): Promise<Web3FormsResult> {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
      ...payload
    })
  })

  const result = await res.json().catch(() => ({}))

  if (!res.ok || !result?.success) {
    return { success: false, message: result?.message }
  }

  return { success: true }
}
