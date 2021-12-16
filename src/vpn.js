addEventListener("fetch", (event) => event.respondWith(handleRequest(event.request)))

const handleRequest = (request) => {
  // immediately return 404 for favicon
  if (request.url.includes("favicon")) return new Response("",{ status: 404})
  // get connecting IP and country
  const ip = request.headers.get("CF-Connecting-IP")
  const country = request.cf?.country
  // check if under api path
  const sendResponse = request.url.includes("/api") ? textResponse : htmlResponse

  // loop through map and check for IP
  const server = ipmap.get(ip)
  return (server)
    ? request.url.endsWith(".json")
      ? jsonResponse({ip, server, country})
      : sendResponse(`IP: ${ip}\nServer: ${server}\nCountry: ${country}`)
    // ip not in list, not connected
    : sendResponse(`Not Connected\nIP: ${ip}\nCountry: ${country}`)
}

const noCache = {"Cache-Control": "no-store"}

const jsonResponse = (res) => new Response(JSON.stringify(res),{headers:{...noCache,"Content-Type":"application/json"}})
const textResponse = (str) => new Response(str,{headers:{...noCache,"Content-Type":"text/plain"}});

const htmlResponse = (ip) => new Response(
  `<!DOCTYPE html><body style=background:#111;color:#ddd;font-size:4em;display:flex;min-height:98vh;justify-content:center;align-items:center><pre>${ip}`,
  {headers: {...noCache, "Content-Type": "text/html"}})