'use client'


import {NavBar, TopBar} from "../../[page]/DashboardUiSet";
import {useParams} from "next/navigation";
import {EditorRenderer, Renderer} from "@/app/duckyengine/Renderer";
import {HashtagIcon, PlusIcon} from "@/app/FlareUI/FlareIcons";
import {Icon} from "@iconify-icon/react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {PageContext} from "@/app/context/PageContext";
import {GrayButton} from "@/app/FlareUI/Basic/Buttons";
import {NewElementPopup} from "../../[page]/EditorHelper";

export default function Page() {
  const params = useParams()
  return (
    <main className="h-screen w-screen flex bg-[#f7f8fa] p-1">
      <NavBar>
        <div className="pl-5 py-2 flex gap-2 items-center text-stone-900/50  rounded-lg">
          <HashtagIcon className="text-xl"/>
          <p className="">Editing {params.tagLine}</p>
        </div>
        <div className="h-0.5 bg-black/5 my-2"/>
        <h1 className="mx-5 mb-1 text-stone-900/50">Category 1</h1>
        <div className="pl-5 py-2 flex gap-2 items-center rounded-lg bg-black/10">
          <Icon className="text-xl" icon="noto-v1:open-book"/>
          <p className="">Main Page</p>
        </div>
        <div className="pl-5 py-2 flex gap-2 items-center rounded-lg">
          <Icon className="text-xl" icon="noto-v1:open-book"/>
          <p className="">API Examples</p>
        </div>
      </NavBar>
      <section className="rounded-2xl h-full overflow-y-auto w-full flex flex-col items-center grow">
        <div className="bg-stone-900 flex sticky rounded-xl p-2 w-full mb-2">
            <div className="bg-orange-fade text-stone-800 px-5 py-2 rounded-lg cursor-pointer select-none hover:bg-orange-100 transition">
              Save
            </div>
        </div>
        <div className="flex-1 relative rounded-2xl w-2/3 flex-col bg-white flex">
          <ProjectPreview data={data}/>
        </div>
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
    {element: "expand", id: "7", order: 7, parent: "root", icon: "tabler:activity", title: "An expandable thing"},
    {element: "code", id: "20", order: 10, parent: "root", code: "insert yoasdfasdfur code\nasdfasdf\n    asdfasdf\nasdfasdfasdf <div>test</div>"},
    {element: "tooltip", id: "17", order: 8, parent: "root", type: "error", text: "Be aware of this error!"}
  ],
  "7": [
    {element: "p", id: "8", order: 8, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "p", id: "9", order: 9, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "p", id: "10", order: 10, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "p", id: "11", order: 11, parent: "7", text: "I am inside of a expandable bloc :)"},
    {element: "tooltip", id: "14", order: 4, parent: "7", type: "error", text: "Be aware of this error!"},
    {element: "expand", id: "12", order: 12, parent: "7", title: "An expandable thing in an expandable"},
  ],
}

function ProjectPreview({data}) {
  const {page, operations, undo, redo, html} = usePageState(data);

  useEffect(() => {
    const handler = (e) => {

      if (e.ctrlKey && e.key === 'z') undo();
      if (e.ctrlKey && e.key === 'y') redo();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [page, redo, undo]);
  

  return (
    <PageContext.Provider value={operations}>
      {html}
      <div className="text-stone-900 gap-3 flex flex-col p-4">
        {page.root
          .sort((a, b) => a.order - b.order)
          .map(element => <EditorRenderer key={element.id} {...element}/>)}
        <div className="flex gap-2">
          <GrayButton title="+ Add new element" onClick={() => operations.askAndInsert({})}/>
          <GrayButton title="[^^] See page" onClick={() => console.log(page)}/>
        </div>
      </div>
    </PageContext.Provider>
  );
}

function usePageState(initial) {
  const [page, setPage] = useState(initial);
  const [addNewPopup, setAddNewPopup] = useState(null);
  const history = useRef([]);
  const future = useRef([]);

  const update = useCallback((newPage) => {
    setPage(prev => {
      history.current.push(prev);
      future.current = [];
      return newPage;
    });
  }, []);

  const undo = () => {
    if (history.current.length === 0) return;
    future.current.push(page);
    setPage(history.current.pop());
  };

  const redo = () => {
    if (future.current.length === 0) return;
    history.current.push(page);
    setPage(future.current.pop());
  };

  const operations = useMemo(() => createOperations(page, update, setAddNewPopup), [page])

  const html = addNewPopup && <NewElementPopup newElement={(e) => operations.addNew(e)}
                     closeFunction={() => setAddNewPopup(null)}
                     order={addNewPopup.order ? addNewPopup.order : null}
                     parent={addNewPopup.parent ? addNewPopup.parent : null}/>
  
  return { page, operations, undo, redo, html };
}

function createOperations(page, update, setAddNewPopup) {
  return {
    page: page,
    getNewID: () => crypto.randomUUID(),
    partialUpdate({id, ...props}) {
      update(Object.fromEntries(
        Object.entries(page).map(([key, value]) => [
          key,
          value.map(e => e.id === id ? { ...e, ...props } : e)
        ])
      ));
    },
    getOrderOf(id) {
      for (const [key, value] of Object.entries(page)) {
        const found = value.find(e => e.id === id);
        if (found) return found.order;
      }
      return null;
    },
    getElement(id) {
      for (const [key, value] of Object.entries(page)) {
        const found = value.find(e => e.id === id);
        if (found) return found;
      }
      return null;
    },
    getParentOf(id) {
      for (const [key, value] of Object.entries(page)) {
        const found = value.find(e => e.id === id);
        if (found) return key;
      }
      return null;
    },
    delete(id) {
      const { [id]: _, ...rest } = page;
      update(Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [
          key,
          value.filter(v => v.id !== id)
        ])
      ));
    },
    duplicate(id) {
      this.addNew({parent: this.getParentOf(id), order: this.getOrderOf(id), element: this.getElement(id)})
    },
    askAndInsert({addUnder = null}) {
      setAddNewPopup({parent: addUnder !== null ? this.getParentOf(addUnder) : "root", order: this.getOrderOf !== null ? this.getOrderOf(addUnder) : null})
    },
    addNew({parent = "root", order = null, element}) {
      let updatedParent;
      if (order === null) {
        const setOrder = page[parent].length === 0
          ? 0
          : Math.max(...page[parent].map(e => e.order)) + 1;
        const newElement = { ...element, id: this.getNewID(), parent, order: setOrder };
        updatedParent = [...page[parent], newElement];
      } else {
        const shifted = page[parent].map(e =>
          e.order > order ? { ...e, order: e.order + 1 } : e
        );
        const newElement = { ...element, id: crypto.randomUUID(), parent, order: order };
        updatedParent = [...shifted, newElement].sort((a, b) => a.order - b.order);
      }
      update({ ...page, [parent]: updatedParent });
    }
  };
}


