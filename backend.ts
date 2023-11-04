import {Hono} from "https://deno.land/x/hono@v3.9.2/hono.ts";

const setupBackend = (app: Hono) => {
  app.get("/ws/", (c) => {
    const { response, socket } = Deno.upgradeWebSocket(c.req);
    
    // websocketのハンドリング
    socket.addEventListener("message", (e) => console.log(e));
    
    return response;
  });
}

export {setupBackend}