import { Hono } from 'https://deno.land/x/hono@v3.9.2/mod.ts'
import {setupFrontend} from "./frontend.ts";
import {setupBackend} from "./backend.ts";

const app = new Hono()

setupFrontend(app)

setupBackend(app);

Deno.serve(app.fetch)
