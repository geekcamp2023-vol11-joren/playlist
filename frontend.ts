import {Hono} from "https://deno.land/x/hono@v3.9.2/hono.ts";

const setupFrontend = (app: Hono) => {
  app.get('/', (c) => c.text('Hello Hono!'))
}

export {setupFrontend}