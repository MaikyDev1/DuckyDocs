import {DeleteIcon, DuplicateIcon, MoreActionsIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useContext, useLayoutEffect, useRef, useState} from "react";
import {PageContext} from "@/app/context/PageContext";
import {PlusIcon} from "../../FlareUI/FlareIcons";
import {HoverFunctionBox, SimpleButton, SimpleHoverableButton} from "../../utils/EditorPopups";

export function Paragraph({id, text}) {
  return (
    <p key={id} className="text-base leading-7">
      {text}
    </p>
  )
}

export function InEditor({ id, text }) {
  const [moreActions, setMoreActions] = useState(null);
  const operations = useContext(PageContext);

  return (
    <div className="group relative items-center flex gap-2">
      <div className="z-10 flex gap-1 cursor-pointer absolute transition group-focus-within:opacity-100 group-hover:opacity-100 hover:opacity-100 opacity-0 text-lg -translate-x-15 w-20">
        <PlusIcon className="text-xl" onClick={() => operations.askAndInsert({ addUnder: id })} />
        <MoreActionsIcon onClick={(e) => setMoreActions({x: e.clientX, y: e.clientY})} className="text-xl" />
      </div>
      {moreActions && (
        <HoverFunctionBox x={moreActions.x} y={moreActions.y} closeFunction={() => setMoreActions(null)}>
          <SimpleButton title="Delete" icon={<DeleteIcon/>} onClick={() => operations.delete(id)}/>
          <SimpleButton title="Duplicate" icon={<DuplicateIcon/>} onClick={() => {
            setMoreActions(null);
            operations.duplicate(id)
          }}/>
        </HoverFunctionBox>
      )}
      <EditableText updateFunction={(text) => operations.partialUpdate({ id: id, text: text })} id={id} text={text} />
    </div>
  );
}
const paragraphModule = {
  element: Paragraph,
  element_name: ["p"],
  in_editor: InEditor
}

export default paragraphModule