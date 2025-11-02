import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {

  const session = await getServerSession(authOptions)
  const userName = session?.user?.name || ""
  // console.log(userName)

  try {
    const { topArtists, topTracks } = await req.json();

    if (!Array.isArray(topArtists) || !Array.isArray(topTracks)) {
      return new Response(
        JSON.stringify({ error: "Invalid data format" }),
        { status: 400 }
      );
    }

    // console.log("Params Artists:", topArtists)
    // console.log("Params Tracks:", topTracks)
    // console.log("Params Artists JOIN:", topArtists.join(", "))
    // console.log("Params Tracks JOIN:", topTracks.join(", "))

    const prompt = `
      Kamu adalah seorang teman yang paham musik dan suka membaca karakter orang lewat lagu favorit mereka.

      Analisis kepribadian user bernama **${userName}** berdasarkan daftar lagu dan artis berikut:
      - Lagu: ${topTracks.join(", ")}
      - Artis: ${topArtists.join(", ")}

      Tuliskan hasil analisis kepribadian ${userName} dalam **4 paragraf pendek** (maksimal 2 kalimat per paragraf).
      Gunakan gaya bahasa **santai, hangat, dan natural**, seolah kamu ngobrol dengan teman sendiri.
      Untuk kalimat pembuka boleh sebut nama ${userName}, tapi selebihnya gunakan kata ganti seperti **"lo"**.

      Hubungkan setiap sifat atau kesan kepribadian dengan **lagu atau artis** yang disebutkan — misalnya suasana lagunya, liriknya, atau vibe dari penyanyinya.

      Pisahkan setiap paragraf dengan tanda tiga garis vertikal tanpa tanda kutip:
      **Contoh output:**
      Paragraf 1|||Paragraf 2|||Paragraf 3|||Paragraf 4

      Hindari kalimat generik seperti "lo orangnya baik dan ceria" tanpa alasan. Setiap paragraf harus terasa personal dan relevan dengan daftar lagu.
    `;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
      },
    });

    const rawRes = response.text ?? "No response, Please try again.";
    const paragraphs = rawRes.split("|||").map(p => p.trim()).filter(Boolean);
    // console.log("Response JSON: ", paragraphs)
    
    return new Response(
      JSON.stringify({ 
        paragraphs 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" }
      },
    );
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        detail: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json"
        } 
      }
    );
  }
}
