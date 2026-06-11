'use client'

import Image from "next/image";
import Link from "next/dist/client/link";
import {StoneButton, WhiteButton} from "@/app/FlareUI/Basic/Buttons";
import {CodeIcon} from "@/app/icons";
import {GithubIcon} from "@/app/FlareUI/FlareIcons";

export default function Home() {
  return (
    <main className="bg-stone-900 absolute w-screen px-10 py-2">
      <div className="fixed z-10 w-full">
        <Navigation/>
      </div>
      <section className="h-[80vh] w-full mt-20">
        <div className="w-full h-full rounded-4xl">
          <MovingGrid/>
        </div>
      </section>
      <section className=" rounded-4xl mt-20">
        <div>
          <p className="text-3xl font-bold font-mono my-2">Documentation that work the way to think.</p>
          <p className="max-w-1/2 text-sm text-stone-300">
            Using DuckyDocs online editor you can create simple or complex documentation for your project. We don&#39;t collect data about you, we just
            need a way to authenticate you and store all the project you created.
          </p>
        </div>
        <div className="flex">
          <div>

          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}

function MovingGrid() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-4xl bg-stone-950">
      {/* grid */}
      <div className="moving-grid absolute inset-0" />

      {/* fade */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-stone-950/20 to-stone-950 z-1" />

      {/* optional edge fade */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-stone-950 z-1" />

      {/* content */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center text-white">
        <Card />
        <p className="text-5xl font-bold text-orange-500">
          Document, write
          <br />
          <span className="text-stone-200">DuckyDocs</span>
        </p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="w-80 bg-stone-900 rounded-tl-3xl absolute right-0 bottom-0 shadow-lg">
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500">Know More →</p>
        <h3 className="font-semibold">Awesome Place</h3>
      </div>
    </div>
  );
}

function Squircle({ className = "", children }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 bg-red-400"
        style={{
          WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='white' d='M25 0 C10 0 0 10 0 25 V75 C0 90 10 100 25 100 H75 C90 100 100 90 100 75 V25 C100 10 90 0 75 0 Z'/%3E%3C/svg%3E\")",
          maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='white' d='M25 0 C10 0 0 10 0 25 V75 C0 90 10 100 25 100 H75 C90 100 100 90 100 75 V25 C100 10 90 0 75 0 Z'/%3E%3C/svg%3E\")",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-950 rounded-4xl select-none mt-10 px-20 py-8 grid grid-cols-4 items-center">
      <div className="col-span-2 gap-2 flex flex-col">
        <Image className="pointer-events-none" src="/DuckyDocsLogo.svg" alt="logo" height="30" width="140"/>
        <p className="text-gray-300 text-sm max-w-2/3">
          A full documentation and notes taking software developed in Romania by a student, with its engine open-source.
        </p>
        <div className="flex mt-1">
          <div className="aspect-square rounded-full p-2 bg-stone-100">
            <GithubIcon className="text-xl text-stone-950"/>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-sm gap-4">
        <p className="font-thin drop-shadow-xl">Extra Links</p>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          Account
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          Dashboard
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          Legal
        </Link>
      </div>
      <div className="flex flex-col text-sm gap-4">
        <p className="font-thin drop-shadow-xl">Service</p>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          Uptime
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          Developer API
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          Contact
        </Link>
      </div>
    </footer>
  )
}

function Navigation() {
  return (
    <nav className="select-none px-20 py-5 flex justify-between items-center">
      <div>
        <Image className="pointer-events-none" src="/DuckyDocsLogo.svg" alt="logo" height="30" width="90"/>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          home
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          about
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          examples
        </Link>
        <Link href="/" className="font-semibold uppercase drop-shadow-xl hover:text-stone-400 hover:scale-[1.05] transition-transform">
          docs
        </Link>
      </div>
      <WhiteButton title="Login"/>
    </nav>
  )
}
