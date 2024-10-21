import { sql } from "@vercel/postgres";
import { Post } from "./definitions";

export async function fetchAllPosts() {
  try {
    const data = await sql<Post>`SELECT * FROM posts`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}
