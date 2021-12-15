addEventListener("fetch", (event) => event.respondWith(handleRequest(event.request)))
const noCache = { "Cache-Control": "no-store" }

const handleRequest = (request) => {
  const {url, headers} = request
  // if looking for favicon, escape early
  if (url.includes("favicon")) return new Response("",{status:404})
  // get connecting IP and country
  const ip = headers.get("CF-Connecting-IP")
  // get country asn and city from request.cf
  // more options here https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
  const {country, asn, city} = (request.cf || {})
  // return json if ends with .json, text response if on API path, otherwise HTML
  return (url.endsWith(".json"))
    ? new Response(JSON.stringify({ip, country, city, asn}),
      {headers:{...noCache, "Content-Type": "application/json"}})
    : (url.endsWith("/api") || headers.get('User-Agent')?.startsWith("curl/") )
      ? new Response(`${ip}\n`,
        {headers:{...noCache, "Content-Type":"text/plain" }})
      : new Response(
        `<!DOCTYPE html><body style=background:#111;color:#ddd;font-size:6em;display:flex;min-height:98vh;justify-content:center;align-items:center><pre>${ip}`,
        { headers: {...noCache,"Content-Type":"text/html"}})
}