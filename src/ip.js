addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})

const handleRequest = (request) => {
  // if looking for favicon, escape early
  if (request.url.includes("favicon")) return new Response(null)
  // get connecting IP and country
  const ip = request.headers.get("CF-Connecting-IP")
  // get country asn and city from request.cf
  // more options here https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
  const { country, asn, city} = (request.cf || {})
  // return json if ends with .json, text response if on API path, otherwise HTML
  return (request.url.endsWith(".json"))
    ? new Response(JSON.stringify({ip, country, city, asn}), {
      headers: {
        ...noCache,
        "Content-Type": "application/json;charset=UTF-8"
      }})
    : (request.url.endsWith("/api") || request.headers.get('User-Agent').startsWith("curl/") )
    ? new Response(ip, {
      headers: {
        ...noCache,
        "Content-Type": "text/plain;charset=UTF-8",
      }})
    : new Response(`<!DOCTYPE html><style>body{background-color:#121212;color:#D5D7D8;font-size:7vmin;display:flex;min-height:calc(100vh - 3.25rem);justify-content:center;align-items:center}</style><pre>${ip}`, {
      headers: {
        ...noCache,
        "Content-Type": "text/html;charset=UTF-8"
      }
    })
}

const noCache = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Expires": "0",
}
