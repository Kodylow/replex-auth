import { Elysia } from 'elysia'
import { connectToDatabase, createUsersTable } from './database'
import { handleGetUser, handleRoot } from './handlers'

const app = new Elysia()
  .get('/', handleRoot)
  .get('/getUser', handleGetUser)
  .listen(3000)

connectToDatabase()
  .then(async () => {
    await createUsersTable()
  })
  .catch(console.error)

console.log(`Listening on localhost:${app.server?.port}`)