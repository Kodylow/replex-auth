import { Elysia } from 'elysia'
import { handleGetUser, handleRoot } from './handlers'

// Database created and exported as a singleton in database.ts

const app = new Elysia()
  .get('/', handleRoot)
  .get('/getUser', handleGetUser)
  .listen(3000)

console.log(`Listening on localhost:${app.server?.port}`)
