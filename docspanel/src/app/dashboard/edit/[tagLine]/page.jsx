'use client'


import {NavBar, TopBar} from "../../DashboardUiSet";
import {useParams} from "next/navigation";

export default function Page() {
  const params = useParams()
  return (
    <main className="h-screen w-screen flex flex-col bg-stone-900">
      <TopBar/>
      <section className="h-full grid grid-cols-8">
        <NavBar/>
        <div className="px-2 py-2">
          <div className="rounded-md p-2 bg-stone-500/10 aspect-square">
            {params.tagLine}
          </div>
        </div>
      </section>
    </main>
  )
}

