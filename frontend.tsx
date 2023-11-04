import { Hono } from "https://deno.land/x/hono@v3.9.2/hono.ts";

const setupFrontend = (app: Hono) => {
  // 部屋作成ページ
  app.get("/", (c) => {
    const createRoomHandler = async () => {
      // TODO: 部屋作成APIを叩く(/api/roomsはapiが分かり次第変更する)
      const res = await fetch("/api/rooms", { method: "POST" });
      const { roomId } = await res.json();
      c.redirect(`/watch?roomId=${roomId}`);
    };
    return c.render(
      <div>
        <h1>部屋作成</h1>
        <button onClick={() => createRoomHandler()}>作成</button>
      </div>
    );
  });
  // 動画投稿ページ /post?roomId=xxxx
  app.get("/post", (c) => {
    return c.render(<PostMovie roomId={c.query.roomId} />);
  });
  // 動画再生ページ /watch?roomId=xxxx
  app.get("/watch", (c) => c.text("Hello Hono!"));
};

export { setupFrontend };
