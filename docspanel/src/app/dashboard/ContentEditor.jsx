'use client'

import {EditorRenderer, getDefaults} from "@/app/duckyengine/Renderer";
import {DashboardIcon, DefaultUserIcon, TempLogo} from "@/app/icons";
import {useState} from "react";
import { Icon } from '@iconify-icon/react';
import {NewElementPopup} from "@/app/dashboard/EditorHelper";
import {GrayButton} from "@/app/FlareUI/Basic/Buttons";

const page_json = {
  meta: {
    title: "Power of Ducks",
    id: "power-of-ducks",
    path: "/power-of-ducks",
    icon: "mdi:duck",
    color: "#FF692A"
  },
  access: {
    mode: "public",
    type: "password",
  },
  elements: [
    {element: "title", size: "h2", text: "Welcome to the power of ducks", id: 1},
    {element: "divider", id: 2},
    {element: "expand", id: 4, title: "test", content: [{element: "p", size: "h2", text: "Welcome to the power of ducks", id: 5}, {element: "p", size: "h2", text: "Welcome to the power of ducks", id: 6}, {element: "p", size: "h2", text: "Welcome to the power of ducks", id: 7}]},
    {element: "p", id: 3, text: "In here you can add elements, change them, or preview them outside of the editor. Preview can be your url or you can use our urls for free!"},
  ]
}


export default function ContentEditor() {
  const [page, setPage] = useState(page_json);
  const [newElement, setNewElement] = useState(false);
  const removeElement = (id) => {
    setPage(prev => ({
      ...prev,
      elements: removeRecursive(prev.elements, id)
    }))
  }

  const addNewElement = (parentId, newElement) => {
    const element = {
      ...newElement,
      id: Date.now()
    }
    setPage(prev => ({
      ...prev,
      elements: addRecursive(prev.elements, parentId, element)
    }))
  }

  const updateElement = (id, updates) => {
    setPage(prev => ({
      ...prev,
      elements: updateRecursive(prev.elements, id, updates)
    }))
  }

  return (
    <main className="h-screen w-screen grid grid-cols-7 bg-stone-800">
      {newElement ? <NewElementPopup parentID="root" addNewElement={addNewElement} closeFunction={() => setNewElement(false)}/> : null}
      <SideBar/>
      <section className="h-full overflow-auto bg-stone-800 col-span-6">
        <TopBar meta={page.meta}/>
        <div onClick={() => alert(JSON.stringify(page.elements))}>
          check source
        </div>
        <div className="px-14 flex flex-col gap-1 py-2">
          {page.elements.map(e =>
            <EditorRenderer key={e.id} functions={{
              addNewElement: addNewElement,
              removeElement: removeElement,
              updateElement: updateElement
            }} {...e}/>
          )}
          <div className="mt-2">
            <GrayButton title="+ Add new element" onClick={() => setNewElement(true)}/>
          </div>
        </div>
      </section>
    </main>
  )
}

function SideBar({}) {
  return (
    <nav className="flex select-none p-2 rounded-r-2xl h-full flex-col col-span-1 bg-stone-900">
      <div className="flex justify-around items-center py-4 border-b border-b-stone-700">
        <div className="flex items-center justify-center gap-2">
          <TempLogo className="text-2xl"/>
          <p className="text-stone-300 font-mono text-lg">DuckyDocs</p>
        </div>
        <div className="p-2 rounded-full bg-stone-700">
          <DefaultUserIcon className="text-2xl"/>
        </div>
      </div>
      <div className="py-5 border-b gap-1 flex flex-col border-b-stone-700">
        <SidebarButton sel={true} name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
        <SidebarButton name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
        <SidebarButton name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
      </div>
      <div className="py-5 gap-1 flex flex-col">
        <SidebarButton name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
        <SidebarButton name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
        <SidebarButton name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
        <SidebarButton name="Dashboard" icon={<DashboardIcon className="text-xl"/>}/>
      </div>
    </nav>
  )
}

function SidebarButton({icon, name, sel}) {
  return (
    <div className={`p-2 cursor-pointer flex items-center gap-2 ${sel ? "bg-stone-800 text-stone-300 border-t border-stone-600 ring ring-stone-950 drop-shadow-2xl" : "text-stone-500"} rounded-xl`}>
      {icon}
      <p className="font-medium text-md">{name}</p>
    </div>
  )
}

function TopBar({meta}) {
  return (
    <nav className="flex flex-col w-full p-2">
      <div className="flex items-center gap-3 p-2">
        <Icon className="text-5xl" icon={meta.icon} style={{color: meta.color}}/>
        <p className="text-lg">{meta.title}</p>
        <p className="border-l border-l-stone-700 pl-2 text-stone-500 font-mono text-sm">Saving is not avaliable</p>
      </div>
    </nav>
  )
}
const removeRecursive = (elements, id) => {
  return elements
    .filter(el => el.id !== id)
    .map(el => ({
      ...el,
      content: el.content
        ? removeRecursive(el.content, id)
        : undefined
    }))
}

const addRecursive = (elements, parentId, newElement) => {
  if (parentId === "root") {
    return [
      ...elements,
      newElement
    ]
  }
  return elements.map(el => {
    if (el.id === parentId) {
      return {
        ...el,
        content: [...(el.content || []), newElement]
      }
    }

    if (el.content) {
      return {
        ...el,
        content: addRecursive(el.content, parentId, newElement)
      }
    }

    return el
  })
}

const updateRecursive = (elements, parentId, updates) => {
  return elements.map(el => {
    if (el.id === parentId) {
      return { ...el, ...updates }
    }

    if (el.content) {
      return {
        ...el,
        content: addRecursive(el.content, parentId, updates)
      }
    }

    return el
  })
}