import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
});

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    throw error;
  }
}

export async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(255) PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE
    );
  `;
  try {
    await client.query(createTableQuery);
    console.log("Users table is ready.");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}

export async function getUserToken(userId: string): Promise<string | null> {
  try {
    const res = await client.query('SELECT token FROM users WHERE user_id = $1', [userId]);
    if (res.rows.length > 0) {
      return res.rows[0].token;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching token for userId ${userId}:`, error);
    throw error;
  }
}

type User = {
  user_id: string;
  user_name: string;
};

export async function getUserByConnectionCode(connectionCode: string): Promise<User | null> {
  try {
    const res = await client.query('SELECT user_id, user_name FROM users WHERE token = $1', [connectionCode]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user for connection code ${connectionCode}:`, error);
    throw error;
  }
}

// Update your storeNewToken function to include user_name
export async function storeNewToken(userId: string, userName: string, token: string): Promise<void> {
  try {
    await client.query('INSERT INTO users (user_id, user_name, token) VALUES ($1, $2, $3)', [userId, userName, token]);
  } catch (error) {
    console.error(`Error storing token for userId ${userId}:`, error);
    throw error;
  }
}