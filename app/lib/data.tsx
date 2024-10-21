export async function fetchAllPosts() {
  const url = `https://qfn.fuu.mybluehost.me/wp-json/wp/v2/posts?_embed`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("===", json);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the posts.");
  }
}
