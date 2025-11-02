import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401 
    })
  }

  try {
    const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=25",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch top tracks")
    }
    
    const data = await res.json()
    return new Response(JSON.stringify(data.items), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "Failed to fetch top tracks" }), { 
      status: 500 
    })
  }
}