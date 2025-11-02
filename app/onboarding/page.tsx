"use client";

import { signIn } from "next-auth/react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import Image from "next/image";
import ParticleBackground from '@/components/ParticleBackground';

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center gap-10 px-6 text-center overflow-hidden">
      
      {/*  PARTICLES (tsParticles)  */}
      <ParticleBackground/>

      {/*  TITLE SECTION  */}
      <div className="w-full flex flex-col justify-center items-center space-y-2 relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent 
          bg-clip-text bg-linear-to-r from-white via-slate-300 to-zinc-400 
          tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          Your Personality in Music
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base md:text-lg font-light mt-3">
          Subtle, calm, and deeply human — your songs reflect who you are.
        </p>
      </div>

      {/*  INFO SECTION  */}
      <div className="w-full flex flex-col justify-center items-center mt-8 space-y-2 relative z-10">
        <p className="text-zinc-300 text-sm sm:text-base">We only analyze your music preferences.</p>
        <p className="text-zinc-300 text-sm sm:text-base">No personal data is stored or tracked.</p>

        <Dialog>
          <DialogTrigger className="mt-3 text-zinc-300 hover:text-white underline underline-offset-4 transition-colors duration-300">
            Learn more
          </DialogTrigger>
          <DialogContent className="bg-[#101114]/90 border border-white/10 backdrop-blur-xl text-zinc-300 rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">What is this?</DialogTitle>
              <DialogDescription className="text-zinc-300 leading-relaxed">
                This site interprets your Spotify listening patterns into a short personality profile.
                We don’t store your data — your insight is generated live and disappears when you leave.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <button
          onClick={() => signIn("spotify")}
          className="mt-8 flex justify-center items-center gap-3 px-6 py-3 rounded-full 
            bg-linear-to-r from-emerald-500 to-green-600 
            hover:from-emerald-400 hover:to-green-500 
            text-white font-semibold text-lg 
            shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] 
            transition-all duration-300">
          <Image src="/spotify-black-icon.png" alt="Spotify logo" width={35} height={35} className="w-7 sm:w-9 h-auto" />
          <p>Login with Spotify</p>
        </button>
      </div>

      {/*  FOOTER  */}
      <div className="mt-16 text-zinc-400 text-sm opacity-70 relative z-10 tracking-widest uppercase">
        <p>warmly yours,</p>
        <p className="text-zinc-300 font-medium">– Yuma</p>
      </div>
    </div>
  );
}
