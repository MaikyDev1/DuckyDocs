import {
  BoldIcon,
  DeleteIcon, DuplicateIcon,
  EditIcon,
  ErrorIcon,
  InfoIcon,
  MoreActionsIcon,
  TitleIcon,
  WarningIcon
} from "@/app/icons";
import {EditableText} from "@/app/duckyengine/DuckyTextEditor";
import {EditElementPopup} from "@/app/dashboard/edit/[project]/EditorHelper";
import {InputTypeBox, SelectItem, SelectTypeBox} from "@/app/FlareUI/Basic/InteractiveFields";
import {useContext, useState} from "react";
import {PageContext} from "@/app/context/PageContext";
import {AskForInput, HoverFunctionBox, SimpleButton, SimpleHoverableButton} from "@/app/utils/EditorPopups";
import {HouseIconDuo, PlusIcon, QuestionMarkIcon} from "@/app/FlareUI/FlareIcons";
import Error from "next/error";

function Helper({icon, color, text}) {
  return (
    <div className="bg-stone-100 p-3 rounded-full corner-squircle w-full items-center flex gap-5">
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
  switch (type.toLowerCase()) {
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
  const operations = useContext(PageContext);
  const [moreActions, setMoreActions] = useState(null);
  const [askTitle, setAskTitle] = useState(false);
  return (
    <div className="group relative items-center flex gap-2">
      {askTitle && (
        <AskForInput
          closeFunction={() => setAskTitle(false)}
          defaultValue={text}
          onSubmit={(value) => {
            operations.partialUpdate({
              id,
              text: value
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
          <SimpleHoverableButton title="Change Type" icon={<WarningIcon/>}>
            <SimpleButton title="Error" icon={<ErrorIcon/>} onClick={() => operations.partialUpdate({id, type: "error"})}/>
            <SimpleButton title="Warning" icon={<WarningIcon/>} onClick={() => operations.partialUpdate({id, type: "warning"})}/>
            <SimpleButton title="Info" icon={<InfoIcon/>} onClick={() => operations.partialUpdate({id, type: "info"})}/>
            <SimpleButton title="Custom" icon={<HouseIconDuo/>} onClick={() => operations.partialUpdate({id, type: "info"})}/>
          </SimpleHoverableButton>
          <div className="h-0.5 m-0.5 bg-white/10"/>
          <SimpleButton title="Delete" icon={<DeleteIcon/>} onClick={() => operations.delete(id)}/>
          <SimpleButton title="Duplicate" icon={<DuplicateIcon/>} onClick={() => {
            setMoreActions(null);
            operations.duplicate(id)
          }}/>
        </HoverFunctionBox>
      )}
      <MatchDefaults type={type} text={<EditableText id={id} text={text} updateFunction={functions ? functions.updateElement : null}/>}/>
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