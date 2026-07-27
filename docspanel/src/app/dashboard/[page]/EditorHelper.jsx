import {BlackButton, GrayButton, StoneButton, WhiteButton} from "@/app/FlareUI/Basic/Buttons";
import {useState} from "react";
import {FadeOrangeButton} from "../../FlareUI/Basic/Buttons";
function BasePopup({children, closeFunction}) {
  return (
    <div onClick={closeFunction} className="bg-white/10 backdrop-blur-[2px] z-100 fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
      <div className="p-2 flex items-center justify-between flex-col py-5 rounded-2xl shadow-2xl  bg-stone-900 min-h-1/4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function NewElementPopup({newElement, parent, order, closeFunction}) {
  const [search, setSearch] = useState("");
  const options = [
    {name: "Basic Blocks", elements: [
        {name: "Paragraph", default: {element: "p", text: "Click to edit"}},
        {name: "Title", default: {element: "title", size: "h1", text: "Click to edit"}},
        {name: "Divider", default: {element: "divider"}},
        {name: "Code", default: {element: "code"}},
        {name: "Tooltip", default: {element: "tooltip", type: "error" , text: "Click to edit"}},
        {name: "Expandable", default: {element: "expand", title: "Click to edit"}},
        {name: "Tabs", default: {element: "Tabs", tabs: 2}},
      ]
    },
    {name: "Advanced Blocks", elements: [
        {name: "API", default: {element: "api", method: "GET", endpoint: "/setup", response: ["200"]}},
      ]
    }
  ]
  return (
    <BasePopup closeFunction={closeFunction}>
      <div className="h-90 my-2 py-2 px-4 flex flex-col gap-2 rounded-2xl overflow-y-scroll ">
        <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="appearance-none outline-none bg-white p-1 px-2 rounded-lg"/>
        {/* BASIC ELEMENTS */}
        {options.map(block => (
          <div className="flex flex-col gap-1" key={block.name}>
            <p className="text-sm border-b border-b-stone-600 text-center">{block.name}</p>
            {block.elements.map (el =>
              (search !== "" && !el.name.toLowerCase().includes(search.toLowerCase())) ?
                null : <FadeOrangeButton key={el.name} title={el.name} onClick={() => {
                  newElement?.({parent: parent, order: order, element: el.default});
                  closeFunction();
                }}/>
            )}
          </div>
        ))}
      </div>
      <div className="w-1/2 flex flex-col">
        <GrayButton title="Close" onClick={closeFunction}/>
      </div>
    </BasePopup>
  )
}

export function EditElementPopup({closeFunction, children}) {
  return (
    <BasePopup closeFunction={closeFunction}>
      <div className="my-2 py-2 items-center min-w-70 px-4 flex flex-col gap-2">
        {children}
      </div>
      <div className="w-1/2 flex flex-col">
        <GrayButton title="Close" onClick={closeFunction}/>
      </div>
    </BasePopup>
  )
}

export function DeleteElementPopup({closeFunction, removeFunction, name}) {
  return (
    <BasePopup closeFunction={closeFunction}>
      <p>Are use sure if you </p>
      <div className="w-1/2 flex flex-col">
        <GrayButton title="Close" onClick={closeFunction}/>
        <BlackButton title="Delete" onClick={removeFunction}/>
      </div>
    </BasePopup>
  )
}