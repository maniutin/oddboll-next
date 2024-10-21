import { db } from "@vercel/postgres";
import { posts } from "../lib/posts-data";

const client = await db.connect();

type Post = {
  title: string;
  content: string;
  excerpt: string;
  category: string;
};

async function seedPosts() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      excerpt TEXT,
      category VARCHAR(255)
    );
  `;

  const insertedPosts = await Promise.all(
    posts.map(async (post: Post) => {
      return client.sql`
        INSERT INTO posts (id, title, content, excerpt, category)
        VALUES (${post.title}, ${post.content}, ${post.excerpt}, ${post.category})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedPosts;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedPosts();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
