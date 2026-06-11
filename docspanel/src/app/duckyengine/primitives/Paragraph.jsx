import {DeleteIcon, EditIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";

export function Paragraph({id, text}) {
  return (
    <p key={id} className="text-base leading-7">
      {text}
    </p>
  )
}

export function InEditor({id, text, functions}) {
  return (
    <div className="flex gap-2 relative">
      <div className="absolute cursor-pointer flex text-lg -translate-x-12">
        <DeleteIcon className="" onClick={() => functions.removeElement(id)}/>
      </div>
      <EditableText id={id} text={text} updateFunction={functions ? functions.updateElement : null}/>
    </div>
  )
}

const paragraphModule = {
  element: Paragraph,
  element_name: ["p"],
  in_editor: InEditor
}

export default paragraphModule