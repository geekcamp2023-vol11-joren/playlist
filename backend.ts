import {Hono} from "https://deno.land/x/hono@v3.9.2/hono.ts";
import { Innertube } from 'https://deno.land/x/youtubei@v7.0.0-deno/deno.ts';
import {uuid} from "./utils/uuid.ts";
import {UUID} from "./types/brand.ts";
import {SupportedSites, TMovieItem} from "./types/api.ts";
import {TMetadataResponse, TWatchV3Error} from "./types/nicovideo.ts";


const rooms:{[key:UUID]:{
  playlist: TMovieItem[],
  handlers: ((val:unknown)=>void)[],
  owner: UUID;
}} = {};


const broadcastPlaylistUpdate = (roomId: UUID) => {
  const room = rooms[roomId];
  if (room === undefined) return;
  room.handlers.forEach((h) => h(room.playlist));
}

const setupBackend = async (app: Hono) => {
  const yt = await Innertube.create();
  app.get("/ws/v1/room/:id/", (c) => {
    const roomId = c.req.param("id");
    if (rooms[roomId] === undefined) {
      return c.text("Room not found", 404);
    }
    const { response, socket } = Deno.upgradeWebSocket(c.req.raw);
    
    socket.addEventListener("message", (e) => console.log(e));
    const handler = (val:unknown) => socket.send(JSON.stringify({
      type: "playlist",
      data: val,
    }));
    rooms[roomId].handlers.push(handler);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "playlist",
        data: rooms[roomId].playlist,
      }));
    }
    socket.onclose = () => {
      rooms[roomId].handlers = rooms[roomId].handlers.filter((s) => s !== handler);
    }
    return response;
  });
  app.post("/api/v1/create",(c)=>{
    const session = c.get('session');
    const roomId = uuid();
    session.id ??= uuid();
    rooms[roomId] = {
      handlers: [],
      playlist: [],
      owner: session.id
    };
    return c.json({
      roomId
    });
  });
  app.post("/api/v1/room/:id/add",async(c)=>{
    const body = await c.req.json() as {url: string,type: SupportedSites}
    const roomId = c.req.param("id") as UUID;
    const room = rooms[roomId];
    const session = c.get('session');
    session.id ??= uuid();
    if (room === undefined) {
      return c.text("Room not found", 404);
    }
    if (body.type === "youtube"){
      const video = await yt.getInfo(body.url);
      room.playlist.push({
        type: "youtube",
        url: body.url,
        metadata: {
          title: video.basic_info.title ?? "",
          channel: video.basic_info.channel?.name ?? "",
          thumbnail: video.basic_info.thumbnail?.[0].url ?? "",
        }
      });
    }else if(body.type === "nicovideo"){
      const req = await fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${body.url}?_frontendId=6&_frontendVersion=0&actionTrackId=a_0`);
      const json = await req.json() as TMetadataResponse;
      const isError = (input:TMetadataResponse): input is TWatchV3Error => input.meta.status !== 200;
      if (isError(json)) {
        return c.text("Failed to fetch metadata", 400);
      }
      if (!json.data.video.isEmbedPlayerAllowed){
        return c.text("Embed Player is not allowed", 400);
      }
      room.playlist.push({
        type: "nicovideo",
        url: body.url,
        metadata: {
          title: json.data.video?.title ?? "",
          channel: json.data.owner?.nickname ?? "",
          thumbnail: json.data.thumbnail?.url ?? "",
        }
      });
    }
    broadcastPlaylistUpdate(roomId);
    return c.text("OK");
  })
}

export {setupBackend}