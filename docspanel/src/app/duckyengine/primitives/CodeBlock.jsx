import {DeleteIcon, DuplicateIcon, EditIcon, MoreActionsIcon, TitleIcon} from "@/app/icons";
import {EditElementPopup} from "@/app/dashboard/[page]/EditorHelper";
import {InputTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createHighlighter} from "shiki";
import {PageContext} from "@/app/context/PageContext";
import {AskForInput, HoverFunctionBox, SimpleButton} from "@/app/utils/EditorPopups";
import {PlusIcon} from "@/app/FlareUI/FlareIcons";


export function CodeBlock({id, title, code = "insert your code", language = ""}) {
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

export function InEditor({id, title = "", code = "insert your code"}) {
  const operations = useContext(PageContext);
  const [moreActions, setMoreActions] = useState(null);
  const [askTitle, setAskTitle] = useState(false);
  return (
    <div className="group relative">
      {askTitle && (
        <AskForInput
          closeFunction={() => setAskTitle(false)}
          defaultValue={title}
          onSubmit={(value) => {
            operations.partialUpdate({
              id,
              title: value
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
      <CodeEditorTextBox updateFunction={(newCode) => operations.partialUpdate({id: id, code: newCode})} title={title} code={code}/>
    </div>
  );
}

function CodeEditorTextBox({updateFunction, title, code}) {
  const [value, setValue] = useState(code);
  const ref = useRef(null);

  const autoResize = () => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  };

  useLayoutEffect(() => {
    autoResize(); // initial mount fix
  }, []);

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <div className="group relative rounded-xl border border-stone-400 overflow-hidden">
      {title && (
        <div className="bg-orange-fade flex">
          <p className="px-5 py-1 font-mono text-orange-500 bg-white rounded-t-lg ml-3 mt-2">
            {title}
          </p>
        </div>
      )}

      <div className="p-2">
          <textarea
            ref={ref}
            value={value}
            spellCheck={false}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => updateFunction?.(e.target.value)}
            className="w-full p-2 font-mono outline-none rounded resize-none overflow-hidden"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();

                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const tab = "  ";

                const newValue =
                  value.substring(0, start) +
                  tab +
                  value.substring(end);

                setValue(newValue);

                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd =
                    start + tab.length;
                }, 0);
              }
            }}
          />
      </div>
    </div>
  )
}


const paragraphModule = {
  element: CodeBlock,
  in_editor: InEditor,
  element_name: ["code"]
}

export default paragraphModule