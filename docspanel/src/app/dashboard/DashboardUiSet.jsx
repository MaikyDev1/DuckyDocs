import Image from "next/image";
import {InputTypeBox, InputTypeBoxWhite} from "../FlareUI/Basic/InteractiveFields";
import Link from "next/dist/client/link";
import {Icon} from "@iconify-icon/react";
import {BookIcon, CogIcon, DuckIcon, HomeNavigationIcon, HouseIconDuo} from "../FlareUI/FlareIcons";

export function TopBar() {
  return (
    <div className="border-b select-none border-b-stone-400 grid grid-cols-8">
      <div className="border-r border-r-stone-400 p-2 2xl:col-span-1 lg:col-span-2 flex items-center justify-center">
      </div>
    </div>
  )
}

export function NavBar({selected, children}) {
  return (
    <nav className="flex w-1/4">
      <div className="bg-stone-900 rounded-2xl px-4 h-full flex flex-col items-center py-10">
          <DuckIcon className="text-5xl"/>
          <div className="h-25"/>
          <div className="grid w-full gap-2">
            <HomeNavigationIcon className="w-full h-full p-2.5"/>
            <BookIcon className="w-full h-full p-2.5 -- rounded-xl bg-linear-to-r from-white/40 to-white/45 drop-shadow-2xl"/>
            <CogIcon className="w-full h-full p-2.5 -- rounded-xl"/>
          </div>
      </div>
      <div className="flex flex-col p-2 py-5 font-semibold text-sm gap-1 text-stone-900 w-full">
        {children}
      </div>
    </nav>
  )
}

function NavigationSimpleButton({href = "/dashboard", title, icon, selected = false}) {
  return (
    <Link href={href} className={`p-1.5 px-3 hover:bg-white/10 rounded-md flex items-center gap-2 ${selected ? "bg-white/10" : ""}`} >
      {icon}
      <span className="text-stone-200 text-[15px]">{title}</span>
    </Link>
  )
}

function NavBarProjectLinkDisplay({project}) {
  return (
    <NavigationSimpleButton href={`./dashboard/edit/${project.tagName}`} title={project.title} icon={<Icon icon={project.icon} className="text-xl"/>}/>
  )
}

