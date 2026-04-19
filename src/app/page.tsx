import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="text-center max-w-2xl relative z-10">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative w-28 h-28 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-110 transition-transform duration-500 cursor-pointer">
            <Image 
              src="/logo.png" 
              alt="OnTime" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            OnTime<span className="text-indigo-500">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200/60 font-medium leading-relaxed max-w-lg mx-auto">
            Vaqtingizni boshqaring, <br /> hayotingizni tartibga soling.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <Link
            href="/login"
            className="group relative px-8 py-4 w-full sm:w-48 bg-white text-slate-950 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-white transition-colors">Kirish</span>
          </Link>
          
          <Link
            href="/register"
            className="px-8 py-4 w-full sm:w-48 bg-white/5 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-white/5 pt-10 animate-in fade-in duration-1000 delay-500">
          <div>
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-xs text-indigo-300/40 uppercase tracking-widest mt-1">Xavfsiz</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Offline</p>
            <p className="text-xs text-indigo-300/40 uppercase tracking-widest mt-1">Rejim</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Sync</p>
            <p className="text-xs text-indigo-300/40 uppercase tracking-widest mt-1">Barcha qurilmalar</p>
          </div>
        </div>

        <p className="mt-16 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
          © 2026 OnTime Ecosystem
        </p>
      </div>
    </div>
  )
}
