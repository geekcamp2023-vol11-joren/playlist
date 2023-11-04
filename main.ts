import { Hono } from 'https://deno.land/x/hono@v3.9.2/mod.ts'
import {
  Session,
  sessionMiddleware,
  CookieStore
} from 'https://deno.land/x/hono_sessions/mod.ts'
import {setupFrontend} from "./frontend.ts";
import {setupBackend} from "./backend.ts";

const app = new Hono<{
  Variables: {
    session: Session,
    session_key_rotation: boolean
  }
}>()
const store = new CookieStore()

app.use('*', sessionMiddleware({
  store,
  encryptionKey: 'password_at_least_32_characters_long', // Required for CookieStore, recommended for others
  expireAfterSeconds: 43200, // Expire session after 15 minutes
  cookieOptions: {
    sameSite: 'Lax',
  },
}))

setupFrontend(app)

setupBackend(app);

Deno.serve(app.fetch)
