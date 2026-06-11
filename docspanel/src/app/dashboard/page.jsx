'use client'

import {NavBar, TopBar} from "./DashboardUiSet";
import {Icon} from "@iconify-icon/react";
import {PlusIcon} from "../FlareUI/FlareIcons";
import {Renderer} from "../duckyengine/Renderer";
import {createContext} from "react";

export default function Page() {
  return (
    <main className="h-screen w-screen flex bg-[#f7f8fa] p-1">
      <NavBar>
        <div className="pl-5 py-2 flex gap-2 items-center text-stone-900/50  rounded-lg">
          <PlusIcon className="text-xl"/>
          <p className="">Create new project</p>
        </div>
        <div className="h-0.5 bg-black/5 my-2"/>
        <h1 className="mx-5 mb-1 text-stone-900/50">Your projects</h1>
        <div className="pl-5 py-2 flex gap-2 items-center rounded-lg bg-black/10">
          <Icon className="text-xl" icon="noto-v1:open-book"/>
          <p className="">Example Project</p>
        </div>
        <div className="pl-5 py-2 flex gap-2 items-center rounded-lg">
          <Icon className="text-xl" icon="noto-v1:open-book"/>
          <p className="">Example Project</p>
        </div>
      </NavBar>
      <section className="rounded-2xl bg-white grow overflow-auto">
        <ProjectPreview page={data}/>
      </section>
    </main>
  )
}

const data = {
  root: [
    {element: "title", id: "1", order: 1, parent: "root", text: "Welcome to an Example Project", size: "h1"},
    {element: "divider", id: "2", parent: "root", order: 2},
    {element: "p", id: "3", order: 3, parent: "root", text: "Welcome to the simplest project from DuckyDocs. In here you will see an example of all the components and features of the application."},
    {element: "p", id: "5", order: 4, parent: "root", text: "If you enjoy this platform,free without ads, consider supporting hosting or contributing to it."},
    {element: "title", id: "6", order: 5, parent: "root", text: "Lets see some cool elements", size: "h2"},
    {element: "tooltip", id: "17", order: 4, parent: "root", type: "error", text: "Be aware of this error!"},
    {element: "expand", id: "7", order: 7, parent: "root", icon: "tabler:activity", title: "An expandable thing"},
    {element: "tabs", id: "14", order: 8, parent: "root", tabs: 2, titles: {1: "Example", 2: "Tab 2"}},
    {element: "code", id: "18", order: 9, parent: "root", title: "main.java", language: "java", code: "public main void() { \n  System.out.println(\"Hello World\");\n}"},
    {element: "code", id: "19", order: 9, parent: "root", language: "sql", code: "SELECT * from users;"},
    {element: "p", id: "21", order: 10, parent: "root", text: "How to print in different languages!"},
    {element: "tabs", id: "20", order: 11, parent: "root", tabs: 3, titles: {1: "Java", 2: "JavaScript", 3: "C"}},
    //{element: "table", id: "30", order: 12, parent: "root", columns: 4, titles: {1: "Company", 2: "Status", 3: "Contact", 4: "Own"}},
    {element: "api", id: "40", order: 4, parent: "root", title: "User details", endpoint: {
        method: "GET", endpoint: "/api/users/[id]", description: "This api will return an user.", auth_required: true, headers: {Authorization: "Bearer token"},
        path_params: {id: {type: "Number", description: "A user id to search"}}, query_params: {short_hand: {description: "Gives just name and email", type: "Boolean", required: false}},
        request_body: "Schema", response: {
          200: "{success: ok}"
        }
      }
    }
  ],
  "7": [
    {element: "p", id: "8", order: 8, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "p", id: "9", order: 9, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "p", id: "10", order: 10, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "p", id: "11", order: 11, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "expand", id: "12", order: 12, parent: "7", title: "An expandable thing in an expandable"},
  ],
  "12": [
    {element: "p", id: "13", order: 13, parent: "12", text: "I am inside of another bloc :)"},
  ],
  "14": [
    {element: "p", id: "15", order: 1, parent: "14", text: "I am inside of tab 1", place: 1},
    {element: "p", id: "16", order: 1, parent: "14", text: "I am inside of tab 2", place: 2},
  ],
  "20": [
    {element: "code", id: "22", order: 1, parent: "20", language: "java", code: "System.out.println(\"Print here \" + \"ANYTINHG\");", place: 1},
    {element: "code", id: "23", order: 1, parent: "20", language: "javascript", code: "alert(\"ALERT\")\nconsole.log(\"Some message in the console\")", place: 2},
    {element: "code", id: "24", order: 1, parent: "20", language: "c", code: "printf(\"%d hello\", [some int here])", place: 3},
    {element: "tooltip", id: "25", order: 3, parent: "20", type: "warning", text: "You must use the libc. For projects where libc is missing use write or syscalls. You can use assembly", place: 3},
    {element: "p", id: "26", order: 2, parent: "20", text: "Make use you read all the documentation on formats from C", place: 3},
  ],
  "30": [
    {element: "code", id: "22", order: 1, parent: "20", language: "java", code: "System.out.println(\"Print here \" + \"ANYTINHG\");", place: 1},
    {element: "code", id: "23", order: 1, parent: "20", language: "javascript", code: "alert(\"ALERT\")\nconsole.log(\"Some message in the console\")", place: 2},
    {element: "code", id: "24", order: 1, parent: "20", language: "c", code: "printf(\"%d hello\", [some int here])", place: 3},
    {element: "tooltip", id: "25", order: 3, parent: "20", type: "warning", text: "You must use the libc. For projects where libc is missing use write or syscalls. You can use assembly", place: 3},
    {element: "p", id: "26", order: 2, parent: "20", text: "Make use you read all the documentation on formats from C", place: 3},
  ]
}

export const PreviewContext = createContext(null);

function ProjectPreview({page}) {
  if (page.root === undefined)
    return (
      <div>No root provided!</div>
    )
  return (
    <PreviewContext.Provider value={page}>
      <div className="text-stone-900 gap-3 flex flex-col p-4">
        {page.root
          .sort((a, b) => a.order - b.order)
          .map(element => <Renderer key={element.id} {...element}/>)}
      </div>
    </PreviewContext.Provider>
  );
}

