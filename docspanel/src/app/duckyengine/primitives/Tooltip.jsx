import {BoldIcon, DeleteIcon, EditIcon, ErrorIcon, InfoIcon, WarningIcon} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {EditElementPopup} from "@/app/dashboard/EditorHelper";
import {InputTypeBox, SelectItem, SelectTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {useState} from "react";

function Helper({icon, color, text}) {
  return (
    <div style={{backgroundColor: `${color}30`}} className="p-3 rounded-md w-full items-center flex gap-5">
      <div style={{color: `${color}`}} className="text-3xl">
        {icon}
      </div>
      <div className="text-stone-800 font-semibold">
        {text}
      </div>
    </div>
  )
}

function MatchDefaults({type, icon, color, text}) {
  switch (type) {
    case "info":
      return <Helper color="#1E9600" icon={<InfoIcon/>} text={text}/>
    case "warning":
      return <Helper color="#f5af19" icon={<WarningIcon/>} text={text}/>
    case "error":
      return <Helper color="#f12711" icon={<ErrorIcon/>} text={text}/>
    case "custom":
      return <Helper color={color} icon={icon} text={text}/>
  }
}

export function ToolTip({type, icon, color, text}) {
  return (
    <div>
      <MatchDefaults type={type} text={text}/>
    </div>
  )
}

export function InEditor({id, type = "error", text, functions}) {
  const [edit, setEdit] = useState(false);
  return (
    <div>
      {edit ? <ToolTipEditModal functions={functions} id={id} type={type} closeFunction={() => setEdit(false)}/> : null}
      <div className="flex relative gap-2">
        <div className="absolute cursor-pointer flex items-center h-full justify-center text-lg -translate-x-12">
          <DeleteIcon className="" onClick={() => functions.removeElement(id)}/>
          <EditIcon className="" onClick={() => setEdit(true)}/>
        </div>
        <MatchDefaults type={type} text={<EditableText id={id} text={text} updateFunction={functions ? functions.updateElement : null}/>}/>
      </div>
    </div>
  )
}

function ToolTipEditModal({functions, closeFunction, id, type}) {
  return (
    <EditElementPopup closeFunction={closeFunction}>
      <p className="text-lg mb-1">Edit toolTip</p>
      <SelectTypeBox onChange={(e) => functions.updateElement(id, {type: e.target.value})} title="Select type" defaultValue={type}>
        <SelectItem text="Info" value="info"/>
        <SelectItem text="Warning" value="warning"/>
        <SelectItem text="Error" value="error"/>
      </SelectTypeBox>
    </EditElementPopup>
  )
}

const toolTipModule = {
  element: ToolTip,
  in_editor: InEditor,
  element_name: ["info", "tooltip"]
}

export default toolTipModule