import {NavBarItem} from "./page";
import {AccountIcon} from "../../FlareUI/FlareIcons";
import {DropDownArrowIcon, LockIcon, WarningIcon} from "../../icons";
import {useState} from "react";
import {InputTypeBox, PrimaryButton, SecondaryButton} from "papaya";
import {Secular_One} from "next/dist/compiled/@next/font/dist/google";
import Link from "next/dist/client/link";

export function ProjectsMenu() {
  return (
    <div className="text-stone-800 w-full gap-5 flex flex-col sm:px-20 px-2 items-center py-10">
      <div className="xl:w-1/2 lg:w-2/3 w-full">
        <section className="flex justify-between items-center">
          <p className="font-semibold text-xl underline decoration-primary">Your projects</p>
          <PrimaryButton title="New project"/>
        </section>
        <section className="mt-5 flex flex-col gap-2">
          <ProjectBox title="Example" id="test"/>
          <ProjectBox title="Cum sa faci" isPrivate={true}/>
        </section>
      </div>
    </div>
  )
}

function ProjectBox({isPrivate, title, id}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-4xl border select-none border-stone-300 corner-squircle">
      <div className="px-5 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <p className="font-semibold">{title}</p>
            {isPrivate && <LockIcon className="text-lg"/>}
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/${id}`}>
              <SecondaryButton title="Go to site"/>
            </Link>
            <Link href={`/dashboard/edit/${id}`}>
              <PrimaryButton title="Edit"/>
            </Link>
          </div>
        </div>
        <p className="text-sm">Last change happen 3 days and 2 hours ago.</p>
      </div>
      {open && (
        <div className="px-5 py-3 transition border-t duration-200 bg-stone-50 border-t-stone-300 flex flex-col gap-1">
          <p className="text-sm font-bold">Visibility</p>
          <div className="flex gap-2">
            <SecondaryButton title={`Make ${isPrivate ? "public" : "private"}`}/>
            <SecondaryButton title={`Add/Change password`}/>
          </div>
          <p className="text-sm font-bold">Domain</p>
          <div>
            <SecondaryButton title="Configure"/>
          </div>
          <p className="text-sm font-bold text-red-600">Danger zone</p>
          <div>
            <SecondaryButton title="Delete"/>
          </div>
        </div>
      )}
      <div onClick={() => setOpen(!open)} className={`flex items-center py-2 text-sm justify-center cursor-pointer hover:bg-stone-100 rounded-b-4xl corner-squircle border-t-stone-300 ${!open && "border-t"}`}>
        <p>Change Project</p>
        <DropDownArrowIcon className={`text-2xl transition duration-300 ${open && "rotate-180"}`}/>
      </div>
    </div>
  )
}