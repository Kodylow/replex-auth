import { Context } from 'elysia'
import { generateHtmlResponse } from './htmlResponse'
import { getUserByConnectionCode, getUserToken, storeNewToken } from './database'
import { randomUUID } from 'crypto'

export async function handleRoot({ request }: Context) {
  const userId = request.headers.get("X-Replit-User-Id")
  const userName = request.headers.get("X-Replit-User-Name")

  if (!userId || !userName) {
    return new Response("User not logged in", { status: 401 })
  }

  try {
    let token = await getUserToken(userId)
    if (!token) {
      token = randomUUID()
      await storeNewToken(userId, userName, token)
    }
    return generateHtmlResponse(userId, userName, token)
  } catch (error) {
    return new Response(`Error processing request for userId ${userId}: ${error}`, { status: 500 })
  }
}

export async function handleGetUser({ query }: Context) {
  const connectionCode = query.connection_code

  if (!connectionCode) {
    return new Response("Missing connection_code parameter", { status: 400 })
  }

  try {
    const user = await getUserByConnectionCode(connectionCode)

    if (!user) {
      return new Response("Invalid connection code", { status: 404 })
    }

    return new Response(JSON.stringify({
      userId: user.user_id,
      userName: user.user_name
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(`Error processing connection code ${connectionCode}:`, error)
    return new Response("Internal server error", { status: 500 })
  }
}