import {EditIcon, TrashIcon} from "@/app/components/IconsDB";
import {ObjectToHtml} from "@/app/service/JsonDuckyParser";
import {Expandable} from "@/app/components/DocsElements";

export function RenderContentArray({content, addElement, removeElement, updateElement}) {
  let html = [];
  for (const element of content) {
    if (Array.isArray(element.element.content)) {
      html.push(<Expandable title={element.title}>
        <RenderContentArray removeElement={removeElement} content={element.element.content}/>
      </Expandable>)
    } else {
      html.push(
        <div key={element.id} className="flex group">
          <div className="absolute w-[100px] gap-2 -translate-x-[100px] flex">
            <div onClick={() => removeElement(element.id)} className="opacity-0 group-hover:opacity-100 cursor-pointer p-1 rounded text-stone-800 bg-white">
              <TrashIcon/>
            </div>
            <div onClick={() => {}} className="opacity-0 group-hover:opacity-100 cursor-pointer p-1 rounded text-stone-800 bg-white">
              <EditIcon/>
            </div>
          </div>
          <ObjectToHtml json={element.element}/>
        </div>
      )
    }
  }
  return (
    <section>
      {html}
      {/*<AddNewElement addElementFunction={addNewElement}/>*/}
    </section>
  )
}