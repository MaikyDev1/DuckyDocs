import {DeleteIcon, EditIcon} from "@/app/icons";
import {EditElementPopup} from "@/app/dashboard/EditorHelper";
import {InputTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {useEffect, useRef, useState} from "react";
import {createHighlighter} from "shiki";


export function CodeBlock({id, title, code = "insert your code", language = "none"}) {
  const [html, setHtml] = useState("");
  const btnRef = useRef(null);

  useEffect(() => {
    createHighlighter({
      themes: ["vitesse-light"],
      langs: [language],
    }).then(highlighter => {
      const result = highlighter.codeToHtml(code, {
        lang: language,
        theme: "vitesse-light",
      });
      setHtml(result);
    });
  }, [code, language]);

  function copy() {
    navigator.clipboard.writeText(code);
    btnRef.current.textContent = "Copied!";
    setTimeout(() => btnRef.current.textContent = "Copy", 2000);
  }

  return (
    <div className="group relative rounded-xl border border-stone-400 overflow-hidden">
      {title && <div className="bg-orange-fade flex"><p className="px-5 py-1 font-mono text-orange-500 bg-white rounded-t-lg ml-3 mt-2">{title}</p></div>}
      <button className="py-1 px-2 rounded-3xl transition mt-1.5 mr-3 text-sm uppercase font-mono bg-orange-fade border border-stone-400 absolute right-0 opacity-0 group-hover:opacity-100" ref={btnRef} onClick={copy}>Copy</button>
      <div className="p-2" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function InEditor({id, title = "", text = "insert your code", language = "javascript", lineNumber = true}) {
  return (
    <div>

    </div>
  )
}

function CodeEditModal({functions, closeFunction, id, size, title}) {
  return (
    <EditElementPopup closeFunction={closeFunction}>
      <p className="text-lg mb-1">Edit Code Box</p>
      <InputTypeBox onChange={(e) => functions.updateElement(id, {title: e.target.value})}
                    title="Add a title (Empty fo no title)" placeholder="Some title" defaultValue={title}
      />
    </EditElementPopup>
  )
}

const paragraphModule = {
  element: CodeBlock,
  in_editor: InEditor,
  element_name: ["code"]
}

export default paragraphModule