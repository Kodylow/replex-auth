import Client from "@replit/database";

export interface User {
  user_id: string;
  user_name: string;
  token: string;
  profile_image: string;
  roles: string[];
  teams: string[];
  url: string;
}

class ReplitDb {
  private static instance: ReplitDb;
  private client: Client;

  private constructor() {
    this.client = new Client();
    console.log("ReplitDb instance created");
  }

  static getInstance(): ReplitDb {
    if (!ReplitDb.instance) {
      ReplitDb.instance = new ReplitDb();
      console.log("New ReplitDb instance created");
    } else {
      console.log("Returning existing ReplitDb instance");
    }
    return ReplitDb.instance;
  }

  async connect(): Promise<void> {
    console.log("Connecting to Replit database...");
    // No need to explicitly connect to Replit DB
    console.log("Connected to Replit database");
  }

  async getUserToken(userId: string): Promise<string | null> {
    console.log(`Fetching token for user ID: ${userId}`);
    const result = await this.client.get(userId);
    if (result.ok) {
      const user = result.value as User;
      console.log(`Token found for user ID: ${userId}`);
      return user?.token ?? null;
    }
    console.log(`No token found for user ID: ${userId}`);
    return null;
  }

  async getUserByToken(token: string): Promise<Omit<User, 'token'> | null> {
    console.log(`Searching for user with token: ${token}`);
    const keys = await this.client.list();
    if (keys.ok) {
      for (const key of keys.value) {
        console.log(`Checking user with ID: ${key}`);
        const result = await this.client.get(key);
        if (result.ok) {
          const user = result.value as User;
          if (user.token === token) {
            console.log(`User found with token: ${token}`);
            const { token: _, ...userWithoutToken } = user;
            return userWithoutToken;
          }
        }
      }
    }
    console.log(`No user found with token: ${token}`);
    return null;
  }

  async storeNewToken(
    user: User
  ): Promise<void> {
    console.log(`Storing new token and user info for user ID: ${user.user_id}`);
    try {
      // Ensure roles is an array
      if (typeof user.roles === 'string') {
        user.roles = this.parseStringToArray(user.roles);
      }
      
      // Ensure teams is an array
      if (typeof user.teams === 'string') {
        user.teams = this.parseStringToArray(user.teams);
      }

      await this.client.set(user.user_id, user);
      console.log(`Token and user info stored successfully for user ID: ${user.user_id}`);
    } catch (error) {
      console.error(`Error storing token for user ID ${user.user_id}:`, error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  private parseStringToArray(input: string): string[] {
    try {
      // First, try parsing as JSON
      return JSON.parse(input);
    } catch (e) {
      // If JSON parsing fails, split by comma and trim
      return input.split(',').map(item => item.trim());
    }
  }

  async wipeDatabase(): Promise<void> {
    console.log("Wiping database...");
    const keys = await this.client.list();
    if (keys.ok) {
      for (const key of keys.value) {
        await this.client.delete(key);
      }
    }
    console.log("Database wiped successfully");
  }
}

// Create and export a single instance
const database = ReplitDb.getInstance();
console.log("Database instance exported");
export default database;
