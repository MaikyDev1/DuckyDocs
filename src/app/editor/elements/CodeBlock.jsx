import {content} from "../../../../tailwind.config";

export function newElementButton() {
  return (
    <div onClick={
      () => addElementFunction({type: "code", code: "test", lineNumbers: true})
    } className="p-1 bg-stone-700 rounded">
      Code
    </div>
  )
}

export function editElement({content, id, updateElement}) {
  let temp = content;
  return (
    <Popup>

    </Popup>
  )
}