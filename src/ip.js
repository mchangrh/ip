addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})

const handleRequest = (request) => {
  // if looking for favicon, escape early
  if (request.url.includes("favicon")) return new Response({ status: 404 })
  // get connecting IP and country
  const ip = request.headers.get("CF-Connecting-IP")
  // get country from request.cf
  // more options here https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
  const country = (request.cf || {}).country
  // return json object if requested
  if (request.url.endsWith(".json")) return jsonResponse({ip, country})
  // return text response includes api path
  return (request.url.includes("/api")) ? textResponse(ip) : htmlResponse(ip)
}

const defaultHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Expires": "0",
}

const jsonResponse = (res) => new Response(JSON.stringify(res), {
  headers: {
    ...defaultHeaders,
    "Content-Type": "application/json;charset=UTF-8"
  }
})

const textResponse = (str) => new Response(str, {
  headers: {
    ...defaultHeaders,
    "Content-Type": "text/plain;charset=UTF-8",
  }
});

const htmlResponse = (res) =>
new Response(`<!DOCTYPE html><style>body{background-color:#121212;color:#D5D7D8;font-size:7vmin;display:flex;min-height:calc(100vh - 3.25rem);justify-content:center;align-items:center}</style><pre>${ip}`, {
  headers: {
    ...defaultHeaders,
    "Content-Type": "text/html;charset=UTF-8"
  }
})