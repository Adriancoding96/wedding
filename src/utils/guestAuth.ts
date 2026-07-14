// HOW TO SET UP GUEST CODES (before launch):
// 1. Decide on your secret codes, e.g. "ACHILL2027", "TABLE5"
// 2. Hash each code with SHA-256 (lowercase hex):
//    Tool: https://emn178.github.io/online-tools/sha256.html
// 3. Replace the placeholder strings in VALID_CODE_HASHES below
// 4. Send the UNHASHED codes to your guests — they type those in

const VALID_CODE_HASHES: string[] = [
  'REPLACE_WITH_SHA256_HASH_OF_CODE_1',
  'REPLACE_WITH_SHA256_HASH_OF_CODE_2',
]

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim().toUpperCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function validateCode(code: string): Promise<boolean> {
  const hash = await sha256(code)
  return VALID_CODE_HASHES.includes(hash)
}

export function setUnlocked(): void {
  localStorage.setItem('guest_unlocked', '1')
}

export function isUnlocked(): boolean {
  return localStorage.getItem('guest_unlocked') === '1'
}
