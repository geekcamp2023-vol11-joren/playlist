import { Hono } from 'https://deno.land/x/hono@v3.9.2/mod.ts'

import {
  Session,
  sessionMiddleware,
  CookieStore
} from 'https://deno.land/x/hono_sessions/mod.ts'
import {cors } from "https://deno.land/x/hono@v3.9.2/middleware.ts";
import {setupBackend} from "./backend.ts";

const app = new Hono<{
  Variables: {
    session: Session,
    session_key_rotation: boolean
  }
}>()
const store = new CookieStore()

app.use('/api/*', sessionMiddleware({
  store,
  encryptionKey: 'password_at_least_32_characters_long', // Required for CookieStore, recommended for others
  expireAfterSeconds: 43200,
  cookieOptions: {
    sameSite: 'Lax',
  },
}))
app.use(
  '/api/*',
  cors({
    origin: '*',
    allowMethods: ['POST', 'GET'],
    maxAge: 43200,
    credentials: true,
  })
)

setupBackend(app);

Deno.serve(app.fetch)
