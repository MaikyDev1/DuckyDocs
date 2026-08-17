import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {useContext} from "react";
import {PageContext} from "@/app/context/PageContext";
import {EditorChangeMenu, sanitize} from "@/app/duckyengine/utils";

export function Paragraph({id, text}) {
  return (
    <p key={id} className="text-base leading-7" dangerouslySetInnerHTML={{ __html: sanitize(text) }}/>
  )
}

export function InEditor({ id, text }) {
  const operations = useContext(PageContext);

  return (
    <div className="group relative items-center flex gap-2">
      <EditorChangeMenu id={id} operations={operations}>
      </EditorChangeMenu>
      <EditableText updateFunction={(text) => operations.partialUpdate({ id: id, text: text })} id={id} text={sanitize(text)} />
    </div>
  );
}
const paragraphModule = {
  element: Paragraph,
  element_name: ["p"],
  in_editor: InEditor
}

export default paragraphModule