const noCache = { "Cache-Control": "no-store" }

addEventListener("fetch", (event) => event.respondWith(handleRequest(event.request)))

const handleRequest = (request) => {
  // if looking for favicon, escape early
  if (request.url.includes("favicon")) return new Response("",{ status: 404})
  // get connecting IP and country
  const ip = request.headers.get("CF-Connecting-IP")
  // get country asn and city from request.cf
  // more options here https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
  const {country, asn, city} = (request.cf || {})
  // return json if ends with .json, text response if on API path, otherwise HTML
  return (request.url.endsWith(".json"))
    ? new Response(JSON.stringify({ip, country, city, asn}), {
      headers: { ...noCache, "Content-Type": "application/json" }
    })
    : (request.url.endsWith("/api") || request.headers.get('User-Agent')?.startsWith("curl/") )
    ? new Response(`${ip}\n`, {
      headers: { ...noCache, "Content-Type": "text/plain" }
    })
    : new Response(`<!DOCTYPE html><body style=background:#111;color:#ddd;font-size:6em;display:flex;min-height:98vh;justify-content:center;align-items:center><pre>${ip}`, {
      headers: { ...noCache, "Content-Type": "text/html" }
    })
}