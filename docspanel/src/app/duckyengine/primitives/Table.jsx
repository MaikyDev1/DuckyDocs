import {CodeIcon, DeleteIcon, DropDownArrowIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useContext, useMemo, useState} from "react";
import {EditorRenderer, Renderer} from "@/app/duckyengine/Renderer";
import {GrayButton} from "@/app/FlareUI/Basic/Buttons";
import {NewElementPopup} from "@/app/dashboard/edit/[project]/EditorHelper";
import {PreviewContext} from "@/app/dashboard/[page]/page";

function Helper({id, titles, columns, current, setCurrent, children}) {
  return (
    <div key={id} className={`border border-stone-400 rounded-xl w-full`}>
      <div className="bg-orange-fade flex pt-2 px-3 rounded-t-xl cursor-pointer select-none gap-2 items-center text-md font-semibold">
        {Object.entries(titles).map(([id, title]) =>
          (<div key={id} onClick={() => setCurrent(id)} className={`${current.toString() === id ? "bg-white text-orange-500" : "hover:bg-white/40"} px-4 py-2 transition rounded-t-lg`}>
            {title}
          </div>)
        )}
      </div>
      <div className={`transition p-4`}>
        {children}
      </div>
    </div>
  )
}

export function Table({id, columns, titles}) {
  const data = useContext(PreviewContext);
  let html = {};
  if (!data) return null;
  for (let i = 1; i <= columns; i++) {
    html[i] = (data[id] ?? [])
      .filter(e => e.place === i)
      .sort((a, b) => a.order - b.order)
      .map(e => <Renderer key={e.id} {...e} />);
  }
  return (
    <Helper id={id} tabs={tabs} columns={columns} titles={titles}>
      {html}
    </Helper>
  )
}

export function InEditor({id, title, content, functions}) {
  const [newElement, setNewElement] = useState(false);
  return (
    <div>
      {newElement ? <NewElementPopup addNewElement={functions.addNewElement} parentID={id} closeFunction={() => setNewElement(false)}/> : null}
      <div className="flex gap-2 relative">
        <div className="absolute cursor-pointer flex items-center h-full justify-center text-lg -translate-x-12">
          <DeleteIcon className="" onClick={() => functions.removeElement(id)}/>
        </div>
        <Helper id={id} title={<div onClick={(e) => e.stopPropagation()}><EditableText id={id} text={title} updateFunction={functions.updateElement}/></div>}>
          {content.map(e => <EditorRenderer key={e.id} {...e} functions={functions}/>)}
          <div className="mt-2">
            <GrayButton title="+ Add new element" onClick={() => setNewElement(true)}/>
          </div>
        </Helper>
      </div>
    </div>
  )
}

const paragraphModule = {
  element: Table,
  element_name: ["table"],
  in_editor: InEditor
}

export default paragraphModule