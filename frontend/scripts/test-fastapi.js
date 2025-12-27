// Quick test script to call FastAPI on localhost (or NEXT_PUBLIC_API_URL)
const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const endpoint = '/openapi.json'

async function run() {
  try {
    const res = await fetch(base + endpoint)
    if (!res.ok) {
      console.error('Request failed', res.status, await res.text())
      process.exit(1)
    }
    const data = await res.json()
    console.log('OpenAPI title:', data.info?.title || 'unknown')
    console.log('Paths count:', Object.keys(data.paths || {}).length)
  } catch (err) {
    console.error('Error calling FastAPI:', err)
    process.exit(1)
  }
}

run()
