import {Hono} from "https://deno.land/x/hono@v3.9.2/hono.ts";

const rooms:{[key:string]:(val:unknown)=>void[]} = {};

const setupBackend = (app: Hono) => {
  app.get("/ws/:id", (c) => {
    const roomId = c.req.param("id");
    const { response, socket } = Deno.upgradeWebSocket(c.req);
    
    socket.addEventListener("message", (e) => console.log(e));
    const handler = (val) => socket.send(JSON.stringify(val));
    rooms[roomId] ??= [];
    rooms[roomId].push(handler);
    socket.onclose = () => {
      rooms[roomId] = rooms[roomId].filter((s) => s !== handler);
    }
    return response;
  });
}

export {setupBackend}