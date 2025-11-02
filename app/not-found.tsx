import Link from "next/link"

function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-center bg-[#0b0c10] relative overflow-hidden">
      
      {/* === BACKGROUND GRADIENT === */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-linear-to-br from-[#0d0e12] via-[#111217] to-[#0b0c10]" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[150px]" />
      </div>

      {/* === TEXT CONTENT === */}
      <h1 className="text-7xl sm:text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-slate-300 to-zinc-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
        404
      </h1>
      <p className="text-zinc-400 text-lg sm:text-xl mt-4 tracking-wide">
        Lost direction?
      </p>

      <Link
        href="/"
        className="mt-8 px-8 py-3 rounded-full bg-linear-to-r from-emerald-500 to-green-600
          hover:from-emerald-400 hover:to-green-500 transition-all duration-300
          text-white font-semibold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]
          hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
      >
        Take me home
      </Link>

      {/* === FOOTER DETAIL OPTIONAL === */}
      <p className="absolute bottom-6 text-sm text-zinc-600 tracking-widest uppercase">
        crafted with balance
      </p>
    </div>
  )
}

export default NotFound
