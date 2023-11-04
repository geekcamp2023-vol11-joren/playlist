import { Hono } from 'https://deno.land/x/hono@v3.9.2/mod.ts'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

app.get("/ws/", (c) => {
  const { response, socket } = Deno.upgradeWebSocket(c.req);
  
  // websocketのハンドリング
  socket.addEventListener("message", (e) => console.log(e));
  
  return response;
});

Deno.serve(app.fetch)
