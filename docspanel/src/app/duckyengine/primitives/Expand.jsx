import {CodeIcon, DeleteIcon, DropDownArrowIcon, EditIcon, MoreActionsIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useContext, useState} from "react";
import {EditorRenderer, Renderer} from "@/app/duckyengine/Renderer";
import {GrayButton} from "@/app/FlareUI/Basic/Buttons";
import {PreviewContext} from "@/app/dashboard/[page]/page";
import {Icon} from "@iconify-icon/react";
import {PageContext} from "@/app/context/PageContext";
import {PlusIcon} from "@/app/FlareUI/FlareIcons";

function Helper({id, title, icon, children}) {
  const [inView, setInView] = useState(false);
  return (
    <div key={id} className={`border border-stone-300 rounded-4xl corner-squircle my-1 px-6 w-full p-5`}>
      <div onClick={() => setInView(!inView)} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon ? <Icon className="text-2xl" icon={icon}/> : null}
          <div className="text-lg font-semibold select-none">{title}</div>
        </div>
        <DropDownArrowIcon className={`text-4xl ${!inView ? "-rotate-90" : "rotate-0"} transition-transform`}/>
      </div>
      <div className={`${!inView ? "hidden" : "mt-2 "} transition-transform flex flex-col gap-2 `}>
        {children}
      </div>
    </div>
  )
}

export function Expand({id, title, icon}) {
  const data = useContext(PageContext);
  if (data === undefined)
    return (
      <Helper id={id} title={title}>
        <p>
          No elements forwarded
        </p>
      </Helper>
    )
  return (
    <Helper id={id} icon={icon} title={title}>
      {data[id] && data[id].sort((a, b) => a.order - b.order).map(e => <Renderer key={e.id} {...e}/>)}
    </Helper>
  )
}

export function InEditor({id, title}) {
  const operations = useContext(PageContext);
  return (
    <div className="flex gap-2 relative">
        <div className="absolute flex gap-1 cursor-pointer transition group-focus-within:opacity-100 group-hover:opacity-100 hover:opacity-100 text-lg z-10 opacity-0 -translate-x-15 w-20">
          <PlusIcon className="text-xl" onClick={() => operations.askAndInsert({addUnder: id})}/>
          <MoreActionsIcon className="text-xl" onClick={() => operations.delete(id)}/>
        </div>
        <Helper id={id} title={
                <div onClick={(e) => e.stopPropagation()}><EditableText id={id} text={title} updateFunction={(text) => operations.partialUpdate({ id: id, text: text })}/></div>
        }>
          {operations.page[id] && operations.page[id].sort((a, b) => a.order - b.order).map(e => <EditorRenderer key={e.id} {...e}/>)}
          <div onClick={() => operations.askAndInsert({parent: id})} className="my-1 bg-stone-200 rounded-full flex justify-center opacity-0 hover:opacity-100 transition">
            <PlusIcon/>
          </div>
        </Helper>
      </div>
  )
}

const paragraphModule = {
  element: Expand,
  element_name: ["expand"],
  in_editor: InEditor
}

export default paragraphModule