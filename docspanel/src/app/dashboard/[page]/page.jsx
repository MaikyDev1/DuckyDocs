'use client'

import {InputTypeBox, PrimaryButton} from "papaya";
import {AccountIcon,PlusIcon} from "../../FlareUI/FlareIcons";
import {useState} from "react";
import {
  GraphIcon,
  BookIcon,
  LogoutIcon,
  NewspaperIcon,
  DashboardIcon,
  HamburgerIcon
} from "../../icons";
import {useParams} from "next/navigation";
import {AccountMenu} from "@/app/dashboard/[page]/AccountSubpage";
import {ProjectsMenu} from "@/app/dashboard/[page]/ProjectsSubpage";

export default function Page() {
  const page = useParams().page;
  const [menu, setMenu] = useState(page);
  const data = {
    activity: [
      {
        publisher: "ADMIN",
        date: "2025-12-31",
        title: "Rolling out a new update soon!",
        description: "Our team is working on new updates that will make your life on our platform simpler. We are at 99% done with this update! The downtime will 5-10 minutes at midnight EEST on 25/07/2026. Sessions will be keept. For change logs wait for the update changelog!"
      }
    ],
    updates: {

    },
  }
  const error = undefined;
  if (error) {
    return (
      <div>Servers are down - Check the official channels for updates!</div>
    );
  }
  const pages = {
    home: <HomeMenu/>,
    account: <AccountMenu/>,
    projects: <ProjectsMenu/>
  };
  return (
    <main className="h-screen w-full flex lg:flex-row flex-col bg-stone-50">
      <DesktopNavigation setMenu={setMenu} menu={menu} />
      <MobileNavigation setMenu={setMenu} menu={menu} />
      {pages[menu] ?? <NotFoundMenu setMenu={setMenu}/>}
    </main>
  )
}

function DesktopNavigation({setMenu, menu}) {
  return (
    <div className="xl:w-75 w-60 h-full border-r select-none text-stone-800 lg:flex hidden gap-2 flex-col border-r-stone-300 px-5 py-3">
      <img className="mb-1" src="/DuckyDocsLogo.svg"/>
      <InputTypeBox placeholder="Search on Dashboard"/>
      <NavBarItem
        title="Home" id="home"
        icon={<DashboardIcon className="text-xl"/>}
        setMenu={setMenu} menu={menu}
      />
      <p className="font-mono uppercase text-sm font-bold">Projects</p>
      <NavBarItem
        title="Statistics" id="statistics"
        icon={<GraphIcon className="text-xl"/>}
        setMenu={setMenu} menu={menu}
      />
      <NavBarItem
        title="Projects" id="projects"
        icon={<BookIcon className="text-xl"/>}
        setMenu={setMenu} menu={menu}
      />
      <NavBarItem
        title="Documentation" id="documentation"
        icon={<NewspaperIcon className="text-xl"/>}
        setMenu={setMenu} menu={menu}
      />

      <p className="font-mono uppercase text-sm font-bold">Account</p>
      <NavBarItem
        title="Account" id="account"
        icon={<AccountIcon className="text-xl"/>}
        setMenu={setMenu} menu={menu}
      />
      <NavBarItem
        title="Logout" id="logout"
        icon={<LogoutIcon className="text-xl"/>}
        setMenu={setMenu} menu={menu}
      />
    </div>
  )
}

function MobileNavigation({setMenu, menu}) {
  const [enable, setEnable] = useState(false);
  return (
    <div className="lg:hidden relative col-span-full select-none text-stone-800 border-b border-b-stone-300 px-5 py-3">
      <div className="flex justify-between items-center">
        <img className="h-10" src="/DuckyDocsLogo.svg"/>
        <HamburgerIcon className="text-4xl p-1" onClick={() => setEnable(!enable)}/>
      </div>
      {enable && (
        <div onClick={() => setEnable(false)} className="z-100 absolute bg-stone-800/10 h-screen left-0 w-screen">
          <div className="p-5 bg-stone-50 border-b border-b-stone-300 rounded-b-2xl">
            <InputTypeBox placeholder="Search on Dashboard"/>
            <NavBarItem
              title="Home" id="home"
              icon={<DashboardIcon className="text-xl"/>}
              setMenu={setMenu} menu={menu}
            />
            <p className="font-mono uppercase py-2 text-sm font-bold">Projects</p>
            <NavBarItem
              title="Statistics" id="statistics"
              icon={<GraphIcon className="text-xl"/>}
              setMenu={setMenu} menu={menu}
            />
            <NavBarItem
              title="Projects" id="projects"
              icon={<BookIcon className="text-xl"/>}
              setMenu={setMenu} menu={menu}
            />
            <NavBarItem
              title="Documentation" id="documentation"
              icon={<NewspaperIcon className="text-xl"/>}
              setMenu={setMenu} menu={menu}
            />

            <p className="font-mono uppercase py-2 text-sm font-bold">Account</p>
            <NavBarItem
              title="Account" id="account"
              icon={<AccountIcon className="text-xl"/>}
              setMenu={setMenu} menu={menu}
            />
            <NavBarItem
              title="Logout" id="logout"
              icon={<LogoutIcon className="text-xl"/>}
              setMenu={setMenu} menu={menu}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function NavBarItem({icon, title, id, menu, setMenu, updateHistory= true}) {
  return (
    <div onClick={() => {
      setMenu(id);
      if (updateHistory) window.history.pushState({}, "", `/dashboard/${id}`);
    }}
      className={`flex select-none items-center gap-3 py-2 px-3 cursor-pointer duration-200 transition corner-squircle rounded-full 
                  ${menu === id ? "bg-stone-200" : "hover:bg-stone-200"}`}>
      {icon}
      <p className="font-normal">{title}</p>
    </div>
  )
}

function NotFoundMenu({setMenu}) {
  return (
    <div className="text-stone-800 w-full gap-5 flex flex-col sm:px-20 px-2 items-center py-10">
      <p className="text-2xl font-bold">This page was not found</p>
      <PrimaryButton onClick={() => { setMenu("home"); window.history.pushState({}, "", `/dashboard/home`);}} title="Go to dashboard"/>
    </div>
  )
}

function HomeMenu() {
  return (
    <div className="text-stone-800 w-full gap-5 flex sm:px-20 px-2 justify-center py-10">
      <section>
        <div className="flex flex-col">
          <p className="text-2xl font-semibold mb-5">Welcome back, Maiky</p>
          <div className="flex gap-2 select-none flex-col md:flex-row">
            <div className="border cursor-pointer hover:scale-[1.02] transition duration-150 rounded-3xl gap-1 flex flex-col items-center justify-center px-10 py-4 corner-squircle border-stone-200">
              <PlusIcon className="text-4xl p-1 rounded-full corner-squircle bg-stone-200"/>
              <p>Create new project</p>
            </div>
            <div className="border cursor-pointer hover:scale-[1.02] transition duration-150 rounded-3xl gap-1 flex flex-col items-center justify-center px-10 py-4 corner-squircle border-stone-200">
              <PlusIcon className="text-4xl p-1 rounded-full corner-squircle bg-stone-200"/>
              <p>Create new project</p>
            </div>
            <div className="border cursor-pointer hover:scale-[1.02] transition duration-150 rounded-3xl gap-1 flex flex-col items-center justify-center px-10 py-4 corner-squircle border-stone-200">
              <PlusIcon className="text-4xl p-1 rounded-full corner-squircle bg-stone-200"/>
              <p>Create new project</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-semibold my-3">Activity Feed</p>
          <div className="flex flex-col relative border-l-2 border-l-stone-400 px-4 py-2 pb-4 select-none">
            <div className="absolute -top-[5px] -left-[7px] h-[12px] w-[12px] rounded-full bg-stone-500"/>
            <div className="-top-[6px] text-xs absolute">May 12 - 2026</div>
            <div className="px-4 py-2 mt-2 bg-stone-200 rounded-full corner-squircle">
              <p>Rolling out a new update soon!</p>
            </div>
          </div>
          <div className="flex flex-col relative border-l-2 border-l-stone-400 px-4 py-2 pb-4 select-none">
            <div className="absolute -top-[5px] -left-[7px] h-[12px] w-[12px] rounded-full bg-yellow-500"/>
            <div className="-top-[6px] text-xs absolute">May 12 - 2026</div>
            <div className="px-4 py-2 mt-2 bg-stone-200 rounded-full corner-squircle">
              <p>Please give us your money!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

