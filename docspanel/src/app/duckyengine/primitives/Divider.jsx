import {DeleteIcon, EditIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {EditElementPopup} from "@/app/dashboard/EditorHelper";
import {InputTypeBox, SelectItem, SelectTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {useState} from "react";

export function Divider({id, size, text}) {
  return (
    <span className="flex py- w-full items-center">
          <span style={{padding: `${size === undefined ? 1 : size}px 0`}} className="grow bg-black/5"></span>
      {text ? <span className="px-4 text-stone-600 font-bold">{text}</span> : null}
      {text ? <span style={{padding: `${size === undefined ? 1 : size}px 0`}} className="grow bg-black/5"></span> : null}
    </span>
  )
}

export function InEditor({id, size = 1, text, functions}) {
  const [edit, setEdit] = useState(false);
  return (
    <div>
      {edit ? <DividerEditModal functions={functions} id={id} size={size} text={text} closeFunction={() => setEdit(false)}/> : null}
      <div className="flex relative gap-2">
        <div className="absolute cursor-pointer flex items-center h-full justify-center text-lg -translate-x-12">
          <DeleteIcon className="" onClick={() => functions.removeElement(id)}/>
          <EditIcon className="" onClick={() => setEdit(true)}/>
        </div>
        <span className="flex py-2 w-full items-center">
          <span style={{padding: `${size}px 0`}} className="grow bg-stone-700"></span>
          {text ? <span className="px-4 text-stone-600 font-bold">{text}</span> : null}
          {text ? <span style={{padding: `${size}px 0`}} className="grow bg-stone-700"></span> : null}
        </span>
      </div>
    </div>
  )
}

function DividerEditModal({functions, closeFunction, id, size, text}) {
  return (
    <EditElementPopup closeFunction={closeFunction}>
      <p className="text-lg mb-1">Edit Divider</p>
      <InputTypeBox onChange={(e) => functions.updateElement(id, {size: e.target.value})}
                    title="Select Size" placeholder="1" defaultValue={size}
                    type="number"
      />
      <InputTypeBox onChange={(e) => functions.updateElement(id, {text: e.target.value})}
                    title="Add a title (Empty fo no title)" placeholder="Some title" defaultValue={text}
      />
    </EditElementPopup>
  )
}

const dividerModule = {
  element: Divider,
  in_editor: InEditor,
  element_name: ["divider"]
}

export default dividerModule