import {DeleteIcon, EditIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useState} from "react";
import {EditElementPopup} from "@/app/dashboard/EditorHelper";
import {SelectItem, SelectTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";

function sizeToTailwindSize(size) {
  switch (size) {
    case "h1": return "text-4xl"
    case "h2": return "text-3xl"
    case "h3": return "text-2xl"
  }
}

export function Title({id, text, size}) {
  return (
    <h1 key={id} className={`${sizeToTailwindSize(size)}`}>
      {text}
    </h1>
  )
}

export function InEditor({id, text, size, functions}) {
  const [edit, setEdit] = useState(false);
  return (
    <div>
      {edit ? <TitleEditModal functions={functions} id={id} size={size} closeFunction={() => setEdit(false)}/> : null}
      <div className="flex relative gap-2">
        <div className="absolute cursor-pointer flex items-center h-full justify-center text-lg -translate-x-12">
          <DeleteIcon className="" onClick={() => functions.removeElement(id)}/>
          <EditIcon className="" onClick={() => setEdit(true)}/>
        </div>
        <div className={`${sizeToTailwindSize(size)} font-bold`}>
          <EditableText id={id} text={text} updateFunction={functions ? functions.updateElement : null}/>
        </div>
      </div>
    </div>
  )
}

function TitleEditModal({functions, closeFunction, id, size}) {
  return (
    <EditElementPopup closeFunction={closeFunction}>
      <p className="text-lg mb-1">Edit Title</p>
      <SelectTypeBox onChange={(e) => functions.updateElement(id, {size: e.target.value})} title="Select size" defaultValue={size}>
        <SelectItem text="H1" value="h1"/>
        <SelectItem text="H2" value="h2"/>
        <SelectItem text="H3" value="h3"/>
      </SelectTypeBox>
    </EditElementPopup>
  )
}

const titleModule = {
  element: Title,
  element_name: ["title"],
  in_editor: InEditor
}

export default titleModule