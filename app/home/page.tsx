"use client"

import { useEffect, useMemo, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Artist } from "@/types/artist"
import { Track } from "@/types/track"
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import LoadingState from "@/components/SpinnerLoading"

export default function DashboardPage() {
  const { data: session } = useSession()
  const user = session?.user ?? { name: "User", image: "https://github.com/evilrabbit.png" }

  const [artists, setArtists] = useState<Artist[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [resArtists, resTracks] = await Promise.all([
          fetch("/api/spotify/top-artists"),
          fetch("/api/spotify/top-tracks"),
        ])
        const [dataArtists, dataTracks] = await Promise.all([
          resArtists.json(),
          resTracks.json(),
        ])
      
        // console.log("Artists JSON: ", resArtists)
        setArtists(Array.isArray(dataArtists) ? dataArtists : [])
        // console.log("Artists RAW: ", dataArtists)
  
        // console.log("Tracks JSON: ", resTracks)
        setTracks(Array.isArray(dataTracks) ? dataTracks : [])
        // console.log("Tracks RAW: ", dataTracks)
      } catch (error) {
        console.log("Error fetching data Spotify: ", error)
        setArtists([])
        setTracks([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const artistList = useMemo(() => artists.map(a => a.name), [artists])
  const trackList = useMemo(() => tracks.slice(0,6).map(t => t.name), [tracks])

  useEffect(() => {
    sessionStorage.setItem("artistList", JSON.stringify(artistList))
    sessionStorage.setItem("trackList", JSON.stringify(trackList))
  }, [artistList, trackList])

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingState />
      </div>
    )
  }
  // console.log("Artists: ", artists)
  // console.log("Tracks: ", tracks)

  // console.log("Artist List: ", artistList)
  // console.log("Track List: ", trackList)

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-black text-white">
      
      {/* SECTION 1 - Profile & Redirect Button */}
      <div className="max-w-4xl w-full flex flex-col sm:flex-row justify-between items-center mt-5 p-3 gap-4">
        <div>
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={user.image ?? "https://github.com/evilrabbit.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="font-bold text-lg sm:text-xl">{user.name ?? "User"}</p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => handleLogout()}
              className="bg-red-500 hover:bg-red-800 text-white px-4 py-1 rounded-md w-full"
            >
              <span className="font-bold">Logout</span>
            </button>
          </div>
        </div>

        <Link href="/personality-insight" className="group">
          <button className="
            relative overflow-hidden px-6 py-3 rounded-full font-bold text-white text-sm sm:text-base
            bg-linear-to-r from-green-500 via-emerald-400 to-green-600
            hover:from-emerald-400 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/40
          ">
            <span className="relative z-10">Check Your Personality</span>
            <span className="
              absolute inset-0 bg-linear-to-r from-green-400 via-emerald-500 to-green-700
              opacity-0 group-hover:opacity-100 transition-opacity duration-500
            "></span>
          </button>
        </Link>
      </div>
      {/* End of Section 1 */}

      {/* SECTION 2 - Top Artists */}
      {artists.length > 0 ? (
        <div className="max-w-4xl w-full mt-10 p-3">
          <p className="font-extrabold text-2xl sm:text-3xl mb-4 text-center sm:text-left">Your Top Artists</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 place-items-center">
            {artists.map((artist, index) => (
              <div key={index} className="flex flex-col items-center">
                <Link href={artist.external_urls.spotify} target="_blank" className="w-[130px] h-[130px] relative">
                  <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="rounded-lg w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="130px"
                    loading="eager"
                    style={{ objectFit: 'cover' }} // or 'contain'
                  />
                </Link>
                <p className="font-bold text-sm sm:text-base mt-2">{index + 1}. {artist.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl w-full mt-10 p-3">
          <div className="relative max-w-4xl w-full mt-10 mx-auto p-6 sm:p-10 rounded-3xl
            bg-white/5 backdrop-blur-xl border border-white/10 
            text-center sm:text-left overflow-hidden 
            shadow-[0_0_40px_rgba(255,255,255,0.05)] 
            animate-fade-in-up"
          >

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-white/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-emerald-400/10 rounded-full blur-[120px]" />
            </div>

            <h2 className="relative font-extrabold text-3xl sm:text-4xl mb-4 
                text-transparent bg-clip-text bg-linear-to-r 
                from-white via-slate-300 to-zinc-400 
                drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              No Artists Found
            </h2>

            <p className="relative text-zinc-400 leading-relaxed text-sm sm:text-base drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
              There are two reasons why this might happen:
              <br/> 1. You haven&apos;t added any artists to your library yet.
              <br/> 2. You may need to refresh the page.
            </p>
          </div>
        </div>
      ) }
      {/* End of Section 2 */}

      {/* SECTION 3 - Top Tracks */}
      {tracks.length > 0 ? (
        <div className="max-w-4xl w-full mt-10 p-3 mb-10">
          <p className="font-extrabold text-2xl sm:text-3xl mb-4 text-center sm:text-left">Top Tracks</p>

          <div className="flex flex-col gap-3">
            {tracks.map((track, index) => (
              <div
                key={index}
                className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 bg-zinc-900/50 p-3 rounded-lg hover:bg-zinc-800/70 transition"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <p>{index +1}. </p>
                  <div className="w-[30px] h-[30px] relative">
                    <Image
                      src={track.album.images[0]?.url as string}
                      alt="tracks"
                      fill
                      sizes="30px"
                      loading="eager"
                      className="rounded"
                    />
                  </div>
                  <p className="font-mono text-sm sm:text-base">{track.name}</p>

                </div>
                <div className="flex flex-row-reverse sm:flex-row justify-between items-center gap-2">
                  <p className="font-serif text-xs sm:text-sm opacity-80">{track.album.artists[0].name}</p>
                  <Link target="_blank" href={track.album.external_urls.spotify}>
                    <Image src="/spotify-white-icon.png" width={20} height={20} alt="spotify"></Image>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl w-full p-3">
          <div className="relative max-w-4xl w-full mx-auto p-6 sm:p-10 rounded-3xl 
            bg-white/5 backdrop-blur-xl border border-white/10 
            text-center sm:text-left overflow-hidden 
            shadow-[0_0_40px_rgba(255,255,255,0.05)] 
            animate-fade-in-up">

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-white/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-emerald-400/10 rounded-full blur-[120px]" />
            </div>

            <h2 className="relative font-extrabold text-3xl sm:text-4xl mb-4 
              text-transparent bg-clip-text bg-linear-to-r 
              from-white via-slate-300 to-zinc-400 
              drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              No Tracks Found
            </h2>

            <p className="relative text-zinc-400 leading-relaxed text-sm sm:text-base drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
              There are two reasons why this might happen:
              <br/> 1. You haven&apos;t added any tracks to your library yet.
              <br/> 2. You may need to refresh the page.
            </p>
          </div>
        </div>
      )}
      {/* End of Section 3 */}
    </div>
  )
}
