import type { Context } from 'elysia'
import { generateHtmlResponse } from './htmlResponse'
import { randomUUID } from 'crypto'
import database, { type User } from './database'

const parseStringToArray = (str: string | null): string[] => {
  if (!str) return [];
  try {
    // Try parsing as JSON
    return JSON.parse(str);
  } catch {
    // If JSON parsing fails, split by comma
    return str.split(',').map(item => item.trim());
  }
};

export async function handleRoot({ request }: Context) {
  console.log('Handling root request')
  const userId = request.headers.get("X-Replit-User-Id")
  const userName = request.headers.get("X-Replit-User-Name")
  const userProfileImage = request.headers.get("X-Replit-User-Profile-Image")
  const userRoles = request.headers.get("X-Replit-User-Roles")
  const userTeams = request.headers.get("X-Replit-User-Teams")
  const userUrl = request.headers.get("X-Replit-User-Url")

  console.log(`User ID: ${userId}, User Name: ${userName}`)

  if (!userId || !userName) {
    console.log('User not logged in')
    return new Response("User not logged in", { status: 401 })
  }

  try {
    console.log(`Fetching token for user ${userId}`)
    let token = await database.getUserToken(userId)
    if (!token) {
      console.log('Token not found, generating new token')
      token = randomUUID()
      console.log(`Storing new token for user ${userId}`)
      const user: User = {
        user_id: userId,
        user_name: userName,
        token,
        profile_image: userProfileImage ?? '',
        roles: parseStringToArray(userRoles),
        teams: parseStringToArray(userTeams),
        url: userUrl ?? ''
      }
      await database.storeNewToken(user)
    }
    console.log('Generating HTML response')
    return generateHtmlResponse(userId, userName, token)
  } catch (error) {
    console.error(`Error processing request for userId ${userId}:`, error)
    return new Response(`Error processing request for userId ${userId}: ${error}`, { status: 500 })
  }
}

export async function handleGetUser({ query }: Context) {
  console.log('Handling getUser request')
  const token = query.token

  console.log(`Token: ${token}`)

  if (!token) {
    console.log('Missing token parameter')
    return new Response("Missing token parameter", { status: 400 })
  }

  try {
    console.log(`Fetching user by token: ${token}`)
    const user = await database.getUserByToken(token)

    if (!user) {
      console.log('Invalid token')
      return new Response("Invalid token", { status: 404 })
    }

    console.log(`User found: ${user.user_id}`)
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(`Error processing token ${token}:`, error)
    return new Response("Internal server error", { status: 500 })
  }
}
