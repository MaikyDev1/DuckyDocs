import {
  DeleteIcon,
  DuplicateIcon,
  EditIcon,
  FontSizeIcon,
  MoreActionsIcon,
  SizeL,
  SizeM,
  SizeS,
  SizeXl
} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useContext, useState} from "react";
import {EditElementPopup} from "@/app/dashboard/EditorHelper";
import {SelectItem, SelectTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {PageContext} from "@/app/context/PageContext";
import {PlusIcon} from "@/app/FlareUI/FlareIcons";
import {HoverFunctionBox, SimpleButton, SimpleHoverableButton} from "@/app/utils/EditorPopups";

function sizeToTailwindSize(size) {
  switch (size) {
    case "h1": return "text-4xl"
    case "h2": return "text-3xl"
    case "h3": return "text-2xl"
    case "h4": return "text-xl"
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
  const operations = useContext(PageContext);
  const [moreActions, setMoreActions] = useState(null);
  return (
    <div className="group relative items-center flex gap-2">
      <div className="z-10 flex gap-1 cursor-pointer absolute transition group-focus-within:opacity-100 group-hover:opacity-100 hover:opacity-100 opacity-0 text-lg -translate-x-15 w-20">
        <PlusIcon className="text-xl" onClick={() => operations.askAndInsert({ addUnder: id })} />
        <MoreActionsIcon onClick={(e) => setMoreActions({x: e.clientX, y: e.clientY})} className="text-xl" />
      </div>
      {moreActions && (
        <HoverFunctionBox x={moreActions.x} y={moreActions.y} closeFunction={() => setMoreActions(null)}>
          <SimpleHoverableButton title="Change Type" icon={<FontSizeIcon/>}>
            {[1, 2, 3, 4].map((i) => (
              <SimpleButton key={`H${i}`} title={`H${i}`} onClick={() => operations.partialUpdate({id: id, size: `h${i}`})}/>
            ))}
          </SimpleHoverableButton>
          <div className="h-0.5 m-0.5 bg-white/10"/>
          <SimpleButton title="Delete" icon={<DeleteIcon/>} onClick={() => operations.delete(id)}/>
          <SimpleButton title="Duplicate" icon={<DuplicateIcon/>} onClick={() => {
            setMoreActions(null);
            operations.duplicate(id)
          }}/>
        </HoverFunctionBox>
      )}
      <div className={`${sizeToTailwindSize(size)}`}>
        <EditableText id={id} text={text} updateFunction={functions ? functions.updateElement : null}/>
      </div>
    </div>
  )
}

function TitleEditPopup({updateFunction, closeFunction, id, size}) {
  return (
    <EditElementPopup closeFunction={closeFunction}>
      <p className="text-lg mb-1">Edit Title</p>
      <SelectTypeBox onChange={(e) => updateFunction(id, {size: e.target.value})} title="Select size" defaultValue={size}>
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