import { Hono } from 'https://deno.land/x/hono@v3.9.2/mod.ts'
import {setupFrontend} from "./frontend.tsx";

const app = new Hono()

setupFrontend(app)

app.get("/ws/", (c) => {
  const { response, socket } = Deno.upgradeWebSocket(c.req);
  
  // websocketのハンドリング
  socket.addEventListener("message", (e) => console.log(e));
  
  return response;
});

Deno.serve(app.fetch)
