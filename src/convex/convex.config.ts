import { defineApp } from 'convex/server'
import better_auth from './better_auth/convex.config'

const app = defineApp()
app.use(better_auth)

export default app
