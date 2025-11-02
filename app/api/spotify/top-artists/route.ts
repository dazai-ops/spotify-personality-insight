import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions)
  // console.log(session)
  
  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401 
    })
  }

  try {
    const res = await fetch(
    "https://api.spotify.com/v1/me/top/artists?limit=5",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        
      }
    )
    // console.log("Response Promise", res)

    if (!res.ok) throw new Error("Failed to fetch top artists")
    
    const data = await res.json()
    // console.log("Response JSON", data)

    return new Response(JSON.stringify(data.items), { status: 290 })
  } catch (error) {
    // console.error("Error message:",error)
    return new Response(JSON.stringify({ error: error }), { 
      status: 500 
    })
  }
}