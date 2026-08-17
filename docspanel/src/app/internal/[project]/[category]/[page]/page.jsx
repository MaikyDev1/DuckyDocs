"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import {useState} from "react";
import {getPage, getSkeleton} from "@/app/internal/[project]/[category]/[page]/DataProvider";
import {Icon} from "@iconify-icon/react";
import {EditorRenderer, Renderer} from "@/app/duckyengine/Renderer";
import {SecondaryButton} from "../../../../../../../../../software/Personal/uikits/dist/index.mjs";
import {PageContext} from "@/app/context/PageContext";

export default function Page() {
  const { project} = useParams();
  const { data, error, isLoading} = useSWR(["s", project], ([, project]) => getSkeleton(project));
  if (error) {
    return (
      <main className="h-screen w-full flex justify-center bg-stone-50">
        <p>Error: {JSON.stringify(error)}</p>
      </main>
    )

  }
  return (
    <main className="h-screen w-full flex justify-center bg-stone-50">
      {isLoading || <Content skeleton={data}/>}
    </main>
  );
}

function Content({skeleton}) {
  const { project, category, page } = useParams();
  const [current, setCurrent] = useState({project, category, page});
  return (
    <div className="text-stone-800 w-3/4 grid grid-cols-10 gap-5 py-10">
      <DesktopSidebar skeleton={skeleton} setCurrent={setCurrent} current={current}/>
      <RenderPage current={current} setCurrent={setCurrent} />
    </div>
  )
}

function DesktopSidebar({setCurrent, current, skeleton}) {
  return (
    <nav className="select-none flex flex-col col-span-2 gap-2">
      <div className="flex items-center gap-2">
        <IconConvertor size={28} icon={skeleton.project.icon}/>
        <p className="text-2xl underline font-semibold decoration-primary">{skeleton.project.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        {skeleton.categories.map((category) => {
          let toReturn = [];
          if (category.slug !== "root")
            toReturn.push(<p key={category.slug} className="font-mono uppercase text-sm font-bold">{category.name}</p>);

          toReturn.push(category.pages.map((el) =>
            <PageLink
              setCurrent={setCurrent} current={current} key={el.slug} icon={el.icon}
              title={el.name} category={category.slug} page={el.slug}
            />
            )
          )
          return toReturn;
        })}
      </div>
      <div className="grow flex flex-col justify-end items-center">
        <div className="corner-squircle border p-4 border-stone-300 rounded-full">
          <p>Powered by DuckyDocs</p>
        </div>
      </div>
    </nav>
  )
}

function RenderPage({setCurrent, current}) {
  const { data, error, isLoading} = useSWR(["p", current.project, current.category, current.page], ([, project, category, page]) => getPage(project, category, page));
  if (isLoading)
    return (
      <section className="col-span-8 bg-stone-200 animate-pulse"/>
    )
  const page = data.data;
  return (
    <section className="col-span-8 overflow-auto">
      <PageContext.Provider value={page}>
        <div className="text-stone-900 gap-3 flex flex-col p-4">
          {page?.root?.sort((a, b) => a.order - b.order)
            .map(element => <Renderer key={element.id} {...element}/>)}
        </div>
      </PageContext.Provider>
    </section>
  )
}

function PageLink({icon, title, category, page, current, setCurrent}) {
  return (
    <div onClick={() => {
            setCurrent({project: current.project, category: category, page: page});
            window.history.pushState({}, "", `/${category}/${page}`);
          }}
         className={`flex items-center justify-between p-2 px-3 ${current.page === page && "bg-stone-200"} hover:bg-stone-200 transition duration-200 rounded-full corner-squircle cursor-pointer select-none`}
    >
      <div className="flex items-center gap-2">
        <IconConvertor size={20} icon={icon}/>
        <p className="font-normal">{title}</p>
      </div>
    </div>
  )
}

function IconConvertor({icon, size}) {
  if (!icon) return null;
  const index = icon.indexOf(":");
  if (index === -1) return null;
  const key = icon.slice(0, index);
  const value = icon.slice(index + 1);
  if (!key || !value) return null;
  switch (key) {
    case "emoji":
      return <span
        style={{
          display: "inline-flex",
          height: size,
          width: size,
          alignItems: "center",
          justifyContent: "center",
          fontSize: size,
        }}
      >
          {value}
        </span>
    case "icon":
      return <Icon height={size} icon={value}/>;
  }
}