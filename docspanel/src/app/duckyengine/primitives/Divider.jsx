import {DeleteIcon, DuplicateIcon, EditIcon, FontSizeIcon, MoreActionsIcon, TitleIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {EditElementPopup} from "@/app/dashboard/edit/[project]/EditorHelper";
import {InputTypeBox, SelectItem, SelectTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {useContext, useState} from "react";
import {PageContext} from "@/app/context/PageContext";
import {PlusIcon} from "@/app/FlareUI/FlareIcons";
import {AskForInput, HoverFunctionBox, SimpleButton, SimpleHoverableButton} from "@/app/utils/EditorPopups";

export function Divider({id, size, text}) {
  return (
    <span className="flex py- w-full items-center">
          <span style={{padding: `${size === undefined ? 1 : size}px 0`}} className="grow bg-stone-400"></span>
      {text ? <span className="px-4 text-stone-600 font-bold">{text}</span> : null}
      {text ? <span style={{padding: `${size === undefined ? 1 : size}px 0`}} className="grow bg-stone-400"></span> : null}
    </span>
  )
}

export function InEditor({id, size, text}) {
  const operations = useContext(PageContext);
  const [moreActions, setMoreActions] = useState(null);
  const [askTitle, setAskTitle] = useState(false);
  return (
    <div className="group relative items-center flex gap-2">
      {askTitle && (
        <AskForInput
          closeFunction={() => setAskTitle(false)}
          defaultValue={text}
          onSubmit={(value) => {
            operations.partialUpdate({
              id,
              text: value
            });
          }}
        >
          <p className="text-lg font-bold">Enter new title</p>
          <p className="text-left">Add a new title for the divider. Leave empty for none!</p>
        </AskForInput>
      )}
      <div className="z-10 flex gap-1 cursor-pointer absolute transition group-focus-within:opacity-100 group-hover:opacity-100 hover:opacity-100 opacity-0 text-lg -translate-x-15 w-20">
        <PlusIcon className="text-xl" onClick={() => operations.askAndInsert({ addUnder: id })} />
        <MoreActionsIcon onClick={(e) => setMoreActions({x: e.clientX, y: e.clientY})} className="text-xl"/>
      </div>
      {moreActions && (
        <HoverFunctionBox x={moreActions.x} y={moreActions.y} closeFunction={() => setMoreActions(null)}>
          <SimpleButton title="Change Title" icon={<TitleIcon/>} onClick={() => setAskTitle(true)}/>
          <div className="h-0.5 m-0.5 bg-white/10"/>
          <SimpleButton title="Delete" icon={<DeleteIcon/>} onClick={() => operations.delete(id)}/>
          <SimpleButton title="Duplicate" icon={<DuplicateIcon/>} onClick={() => {
            setMoreActions(null);
            operations.duplicate(id)
          }}/>
        </HoverFunctionBox>
      )}
      <Divider text={text} size={size}/>
    </div>
  )
}

const dividerModule = {
  element: Divider,
  in_editor: InEditor,
  element_name: ["divider"]
}

export default dividerModule