addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})

const handleRequest = (request) => {
  // immediately return 404 for favicon
  if (request.url.includes("favicon")) return new Response({ status: 404})
  // get connecting IP and country
  const ip = request.headers.get("CF-Connecting-IP")
  const country = (request.cf || {}).country
  // check if under api path
  const sendResponse = request.url.includes("/api") ? textResponse : htmlResponse

  // loop through map and check for IP
  for (let [k, server] of ipmap) {
    if (ip.startsWith(k)) {
      return request.url.endsWith(".json")
        ? jsonResponse({ip, server, country})
        : sendResponse(`IP: ${ip}\nServer: ${server}\nCountry: ${country}`)
    }
  }
  // IP not in list, not connected
  return sendResponse('Not Connected')
}

const noCache = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Expires": "0",
}

const jsonResponse = (res) => new Response(JSON.stringify(res), {
  headers: { ...noCache, "Content-Type": "application/json;charset=UTF-8" }
})

const textResponse = (str) => new Response(str, {
  headers: { ...noCache, "Content-Type": "text/plain;charset=UTF-8" }
});

const htmlResponse = (ip) =>
new Response(`<!DOCTYPE html><style>body{background:#111;color:#ddd;font-size:7vmin;display:flex;min-height:98.5vh;justify-content:center;align-items:center}</style><pre>${ip}`, {
  headers: { ...noCache, "Content-Type": "text/html;charset=UTF-8" }
})