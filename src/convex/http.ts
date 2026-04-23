import { httpRouter } from 'convex/server'
import { auth_component, create_auth } from './auth.js'

const http = httpRouter()

auth_component.registerRoutes(http, create_auth)

export default http
