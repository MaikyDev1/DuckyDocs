import {BasicPopup, SecondaryButton, SearchableSelectFlow, SelectFlowItem, SelectFlowDivider} from "papaya";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {PageContext} from "@/app/context/PageContext";
import {EditorRenderer} from "@/app/duckyengine/Renderer";
import {fetcher} from "@/app/api/fetcher";
import {savePageToCache} from "@/app/dashboard/edit/[project]/DataProvider";
import {mutate} from "swr";

export function NewElementPopup({newElement, parent, order, closeFunction}) {
  const options = [
    {name: "Basic Blocks", elements: [
        {name: "Paragraph", default: {element: "p", text: "Click to edit"}},
        {name: "Title", default: {element: "title", size: "h1", text: "Click to edit"}},
        {name: "Divider", default: {element: "divider"}},
        {name: "Code", default: {element: "code"}},
        {name: "Tooltip", default: {element: "tooltip", type: "error" , text: "Click to edit"}},
        {name: "Expandable", default: {element: "expand", title: "Click to edit"}},
        {name: "Tabs", default: {element: "tabs", tabs: 2}},
      ]
    },
    {name: "Advanced Blocks", elements: [
        {name: "API", default: {element: "api", method: "GET", endpoint: "/setup", response: ["200"]}},
      ]
    }
  ]
  return (
    <BasicPopup buttons={<SecondaryButton title="Close" onClick={closeFunction}/>} onClose={closeFunction}>
      <div className="max-h-80 overflow-auto">
        <SearchableSelectFlow>
          {options.map(cat => {
            let tmp = [<SelectFlowDivider key={cat.name} name={cat.name}/>];
            cat.elements.forEach(e => tmp.push (
              <SelectFlowItem key={e.name} title={e.name} id={e.name}
              onClick={() => {newElement?.({parent: parent, order: order, element: e.default}); closeFunction();}}/>
            ))
            return tmp;
          })}
          <SelectFlowItem id="test"/>
        </SearchableSelectFlow>
      </div>
    </BasicPopup>
  )
}

export function ProjectPreview({data, project, category, pageId}) {
  const {page, operations, undo, redo, html} = usePageState(data);

  useEffect(() => {
    const savePage = async () => {

    }
    const handler = (e) => {

      if (e.ctrlKey && e.key === 'z') undo();
      if (e.ctrlKey && e.key === 'y') redo();
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        savePageToCache(page, project, category, pageId);
        mutate(["p", project, category, pageId], page, false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [category, page, pageId, project, redo, undo]);

  return (
    <PageContext.Provider value={operations}>
      {html}
      <div className="text-stone-900 gap-3 flex flex-col p-4">
        {page?.root?.sort((a, b) => a.order - b.order)
          .map(element => <EditorRenderer key={element.id} {...element}/>)}
        <div className="flex gap-2">
          <SecondaryButton title="Add new element" onClick={() => operations.askAndInsert({})}/>
        </div>
      </div>
    </PageContext.Provider>
  );
}

function usePageState(initial, project, category, pageId) {
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

  const operations = useMemo(() => createOperations(page, update, setAddNewPopup), [page, update])

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
    askAndInsert({addUnder = null, parent = null}) {
      const addAt = parent === null ? addUnder !== null ? this.getParentOf(addUnder) : "root" : parent;
      setAddNewPopup({parent: addAt, order: this.getOrderOf !== null ? this.getOrderOf(addUnder) : null})
    },
    addNew({parent = "root", order = null, element}) {
      const parentArray = page[parent] ? page[parent] : [];
      let updatedParent;
      if (order === null) {
        const setOrder = parentArray.length === 0
          ? 0
          : Math.max(...parentArray.map(e => e.order)) + 1;
        const newElement = { ...element, id: this.getNewID(), parent, order: setOrder };
        updatedParent = [...parentArray, newElement];
      } else {
        const shifted = parentArray.map(e =>
          e.order > order ? { ...e, order: e.order + 1 } : e
        );
        const newElement = { ...element, id: crypto.randomUUID(), parent, order: order };
        updatedParent = [...shifted, newElement].sort((a, b) => a.order - b.order);
      }
      update({ ...page, [parent]: updatedParent });
    }
  };
}

