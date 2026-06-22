'use client'

import React, {useEffect, useRef} from "react";
import {
  BoldIcon, ClearIcon, CodeIcon,
  ColorPalletIcon,
  FontSizeIcon,
  ItalicIcon, LetterAUnderlineIcon,
  SizeL,
  SizeM,
  SizeS,
  SizeXl, SubscriptIcon, SuperscriptIcon,
  UnderlineIcon
} from "@/app/icons";

export function EditableText({id, updateFunction, text}) {

  let colors = ["#FF6467", "#FFB93B", "#7CCF35", "#31C950", "#2A9689", "#21BCFF","#8E51FF", "#FF2056"]

  const editorRef = useRef(null);

  function run(command, value) {
    editorRef.current?.focus()
    document.execCommand(command,false, value)
  }

  useEffect(() => {
    editorRef.current.innerHTML = text
  }, [text]);

  return (
    <div className="group">
      <p id={id} className="peer outline-none min-w-10"
         ref={editorRef}
         onBlur={(e) => updateFunction?.(e.target.innerHTML)}
         suppressContentEditableWarning
         contentEditable>
      </p>
      <div className="p-2 absolute z-110 flex text-sm gap-1 text-white bg-stone-700 opacity-0 rounded-lg shadow-lg invisible group-focus-within:opacity-100 group-focus-within:visible">
        <SimpleButton icon={<BoldIcon className="text-2xl"/>} onClick={() => run('bold')}/>
        <SimpleButton icon={<ItalicIcon className="text-2xl"/>} onClick={() => run('italic')}/>
        <SimpleButton icon={<UnderlineIcon className="text-2xl"/>} onClick={() => run('underline')}/>
        <MultiButton icon={<FontSizeIcon className="text-2xl"/>}>
          <SimpleButton icon={<SizeS className="text-2xl"/>} onClick={() => run('fontSize', "2")}/>
          <SimpleButton icon={<SizeM className="text-2xl"/>} onClick={() => run('fontSize', "3")}/>
          <SimpleButton icon={<SizeL className="text-2xl"/>} onClick={() => run('fontSize', "4")}/>
          <SimpleButton icon={<SizeXl className="text-2xl"/>} onClick={() => run('fontSize', "5")}/>
        </MultiButton>
        <MultiButton icon={<ColorPalletIcon className="text-2xl"/>}>
          {colors.map(c =>
            <SimpleButton key={c} icon={<LetterAUnderlineIcon style={{color: c}} className="text-2xl"/>} onClick={() => run('foreColor', c)}/>
          )}
        </MultiButton>
        <SimpleButton icon={<SuperscriptIcon className="text-2xl"/>} onClick={() => run('superscript')}/>
        <SimpleButton icon={<SubscriptIcon className="text-2xl"/>} onClick={() => run('subscript')}/>
        <SimpleButton icon={<CodeIcon className="text-2xl"/>} onClick={() => wrapWithBackticks()}/>
        <SimpleButton icon={<ClearIcon className="text-2xl"/>} onClick={() => run('removeFormat')}/>
        <button type="button" onClick={() => alert(editorRef.current.innerHTML)}>
          See
        </button>
      </div>
    </div>
  )
}

function SimpleButton({onClick, icon}) {
  return (
    <button type="button" className="p-1" onClick={onClick}>
      {icon}
    </button>
  )
}

function MultiButton({onClick, icon, children}) {
  return (
    <div className="group/btn">
      <div className="h-full w-full flex items-center justify-center">
        {icon}
      </div>
      <div
        className="opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible absolute w-44 -translate-x-1/3 flex justify-center bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg">
        <div className="grid grid-cols-4">
          {children}
        </div>
      </div>
    </div>
  )
}