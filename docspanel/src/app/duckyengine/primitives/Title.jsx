import {FontSizeIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useContext} from "react";
import {PageContext} from "@/app/context/PageContext";
import {SimpleButton, SimpleHoverableButton} from "@/app/utils/EditorPopups";
import {EditorChangeMenu, sanitize} from "@/app/duckyengine/utils";

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
    <h1 key={id} className={`${sizeToTailwindSize(size)}`} dangerouslySetInnerHTML={{ __html: sanitize(text) }}/>
  )
}

export function InEditor({id, text, size}) {
  const operations = useContext(PageContext);

  return (
    <div className="group relative items-center flex gap-2">
      <EditorChangeMenu id={id} operations={operations}>
        <SimpleHoverableButton title="Change Type" icon={<FontSizeIcon/>}>
          {[1, 2, 3, 4].map((i) => (
            <SimpleButton key={`H${i}`} title={`H${i}`} onClick={() => operations.partialUpdate({id: id, size: `h${i}`})}/>
          ))}
        </SimpleHoverableButton>
      </EditorChangeMenu>
      <div className={`${sizeToTailwindSize(size)}`}>
        <EditableText id={id} text={sanitize(text)} updateFunction={(text) => operations.partialUpdate({ id: id, text: text })}/>
      </div>
    </div>
  )
}

const titleModule = {
  element: Title,
  element_name: ["title"],
  in_editor: InEditor
}

export default titleModule