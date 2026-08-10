'use client'


import {useParams} from "next/navigation";
import {AccountIcon, HashtagIcon, MoreActionsDots, PlusIcon} from "@/app/FlareUI/FlareIcons";
import {Icon} from "@iconify-icon/react";
import {NewElementPopup, ProjectPreview} from "./EditorHelper";
import {
  BookIcon,
  ColorPalletIcon,
  DashboardIcon,
  GraphIcon,
  HamburgerIcon,
  LogoutIcon,
  NewspaperIcon
} from "@/app/icons";
import {BasicPopup, InputTypeBox, PrimaryButton, SecondaryButton} from "papaya";
import useSWR from "swr";
import {fetcher} from "@/app/api/fetcher";
import {useState} from "react";
import {AddUnderPage, PageLink} from "@/app/dashboard/edit/[project]/EditorSidebar";
import {commitAll, getPage, getSkeleton} from "@/app/dashboard/edit/[project]/DataProvider";

export default function Page() {
  const project = useParams().project;
  const { data, error, isLoading} = useSWR(["s", project], ([, project]) => getSkeleton(project));
  const [menu, setMenu] = useState()
  return (
    <main className="h-screen w-full flex lg:flex-row flex-col bg-stone-50">
      <DesktopNavigation setMenu={setMenu} menu={menu} />
      <MobileNavigation setMenu={setMenu} menu={menu} />
      <div className="w-full">
        <div className="border-b border-b-stone-300 flex gap-3 items-center w-full p-2 text-stone-800">
          <PrimaryButton title="Save page" onClick={() => commitAll(project)}/>
          <p>This is local version of the document! Please save to persist the changes!</p>
        </div>
        {!isLoading && <EditorMenu project={project} skeleton={data}/>}
      </div>
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
  const [enable, setEnable] = useState(true);
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

// ================= EDITOR CONTENT FLOW ======================

function EditorMenu({project, skeleton}) {
  const [page, setPage] = useState({category: "root", page: skeleton.categories[0]?.pages?.[0].slug})
  return (
    <div className="text-stone-800 w-full gap-20 flex sm:px-20 px-2 py-10">
      <section className="w-1/6">
        <div className="text-2xl underline decoration-primary">
          {skeleton.project.name}
        </div>
        {skeleton.categories.map((category) => {
          let toReturn = [];
          if (category.slug !== "root") toReturn.push(<p key={category.slug} className="font-mono uppercase text-sm font-bold">{category.name}</p>);
          toReturn.push(
            category.pages.map((el) => <PageLink
              selected={page.page === el.slug} setPage={setPage} key={el.slug} icon={el.icon}
              title={el.name} category={category.slug} project={project} page={el.slug}
            />)
          )
          toReturn.push(<AddUnderPage key={category.name+category.slug + ""} category={category.slug} project={project}/>)
          return toReturn;
        })}
      </section>
      <section className="w-1/2">
        <PagePreview project={project} page={page.page} category={page.category}/>
      </section>
    </div>
  )
}

// ============================ PREVIEW STARTER ====================================


function PagePreview ({project, page, category}) {
  const { data, error, isLoading } = useSWR(["p", project, category, page], ([, project, category, page]) => getPage(project, category, page));
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load. {}</div>;
  return <ProjectPreview key={`${project}|${category}|${page}`} data={data.data} project={project} pageId={page} category={category}/>
}

// =========================== OTHER =====================================

function ErrorMenu({setMenu, error}) {
  return (
    <div className="text-stone-800 w-full gap-5 flex flex-col sm:px-20 px-2 items-center py-10">
      <p className="text-2xl font-bold">There is an error: {JSON.stringify(error)}</p>
      <PrimaryButton onClick={() => { setMenu("home"); window.history.pushState({}, "", `/dashboard/home`);}} title="Go to dashboard"/>
    </div>
  )
}
