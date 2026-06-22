import {useLayoutEffect, useRef, useState} from "react";
import {DeleteIcon, DropDownArrowIcon, DuplicateIcon} from "@/app/icons";
import {InputTypeBox} from "../FlareUI/Basic/InteractiveFields";
import {FadeOrangeButton, GrayButton} from "@/app/FlareUI/Basic/Buttons";

function Popup({children, closeFunction}) {
  return (
    <div onClick={closeFunction} className="bg-white/10  text-stone-100 backdrop-blur-[2px] z-100 fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
      <div className="p-2 flex items-center justify-between flex-col py-5 rounded-2xl shadow-2xl  bg-stone-800 min-h-1/4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function AskForInput({ closeFunction, defaultValue = "", onSubmit, children }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Popup closeFunction={closeFunction}>
      <div className="my-2 py-2 items-center min-w-100 px-4 flex flex-col gap-2">
        {children}
        <InputTypeBox autoFocus={true} defaultValue={value} onChange={(e) => setValue(e.target.value)}/>
      </div>

      <div className="flex gap-2">
        <GrayButton
          title="Cancel"
          onClick={closeFunction}
        />

        <FadeOrangeButton
          title="Save"
          onClick={() => {
            onSubmit?.(value);
            closeFunction();
          }}
        />
      </div>
    </Popup>
  );
}

export function CloseablePopup({closeFunction, children}) {
  return (
    <Popup closeFunction={closeFunction}>
      <div className="my-2 py-2 items-center min-w-70 px-4 flex flex-col gap-2">
        {children}
      </div>
      <div className="w-1/2 flex flex-col">
        <FadeOrangeButton title="Close" onClick={closeFunction}/>
        <FadeOrangeButton title="Close" onClick={closeFunction}/>
      </div>
    </Popup>
  )
}

export function HoverFunctionBox({x, y, closeFunction, children}) {
  const menuRef = useRef(null);
  useLayoutEffect(() => {
    if (!menuRef.current) return;

    const el = menuRef.current;
    const rect = el.getBoundingClientRect();

    const padding = 10;

    let newX = x - rect.width / 2;
    let newY = y - rect.height / 2;

    // clamp X
    if (newX < padding) newX = padding;
    if (newX + rect.width > window.innerWidth - padding) {
      newX = window.innerWidth - rect.width - padding;
    }

    // clamp Y
    if (newY < padding) newY = padding;
    if (newY + rect.height > window.innerHeight - padding) {
      newY = window.innerHeight - rect.height - padding;
    }

    el.style.left = `${newX}px`;
    el.style.top = `${newY}px`;
  }, [x, y]);

  return (
    <div ref={menuRef} onMouseLeave={closeFunction}
      style={{
        position: "fixed",
        left: x,
        top: y,
      }} className="p-2 rounded-lg -translate-x-10 gap-1 z-50 flex flex-col bg-stone-900 select-none cursor-pointer text-white">
      {children}
    </div>
  )
}

export function SimpleButton({onClick, title, icon}) {
  return (
    <div onClick={onClick} className="text-lg flex gap-1 items-center px-2 hover:bg-white/10 rounded">
      {icon}
      <p>{title}</p>
    </div>
  )
}

export function SimpleHoverableButton({children, title, icon}) {
  return (
    <div className="relative group/btn z-50">
      <div className="text-lg flex items-center justify-between px-2 hover:bg-white/10 rounded">
        <div className="flex items-center gap-1">
          {icon}
          <p>{title}</p>
        </div>
        <DropDownArrowIcon className="-rotate-90"/>
      </div>

      {/* IMPORTANT: hover area bridge */}
      <div className="absolute top-0 left-full ml-0 pl-2 hidden group-hover/btn:block">
        <div className="p-2 bg-stone-800 rounded-lg flex flex-col gap-1 min-w-30">
          {children}
        </div>
      </div>
    </div>
  )
}