import DOMPurify from "dompurify";
import {useState} from "react";
import {CogIcon, PlusIcon} from "@/app/FlareUI/FlareIcons";
import {DeleteIcon, DropDownArrowIcon, DuplicateIcon} from "@/app/icons";
import {HoverFunctionBox, SimpleButton} from "@/app/utils/EditorPopups";

export function sanitize(text) {
  return  DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "s", "br", "font"],
    ALLOWED_ATTR: ["color"]
  });
}


export function EditorChangeMenu({id, operations, children}) {
  const [moreActions, setMoreActions] = useState(null);
  return [
      <div key="edit-keys" className="z-10 flex gap-1 cursor-pointer absolute transition group-hover:opacity-100 hover:opacity-100 opacity-0 text-lg -translate-x-15 w-20">
        <PlusIcon className="text-xl" onClick={() => operations.askAndInsert({ addUnder: id })} />
        <CogIcon onClick={(e) => setMoreActions({x: e.clientX, y: e.clientY})} className="text-xl" />
      </div>,
      moreActions && (
        <HoverFunctionBox key="edit-hover-box" x={moreActions.x} y={moreActions.y} closeFunction={() => setMoreActions(null)}>
          {children}
          {!children ? null : <div className="h-0.5 m-0.5 bg-stone-300"/>}
          <SimpleButton title="Move up" icon={<DropDownArrowIcon className="rotate-180"/>} onClick={() => operations.moveUp(id)}/>
          <SimpleButton title="Move down" icon={<DropDownArrowIcon/>} onClick={() => operations.moveDown(id)}/>
          <SimpleButton title="Delete" icon={<DeleteIcon/>} onClick={() => operations.delete(id)}/>
          <SimpleButton title="Duplicate" icon={<DuplicateIcon/>} onClick={() => {
            setMoreActions(null);
            operations.duplicate(id)
          }}/>
        </HoverFunctionBox>
      )
    ]
}