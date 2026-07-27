import {NavBarItem} from "./page";
import {AccountIcon} from "../../FlareUI/FlareIcons";
import {WarningIcon} from "../../icons";
import {useState} from "react";
import {InputTypeBox, PrimaryButton, SecondaryButton} from "papaya";

export function AccountMenu() {
  const [menu, setMenu] = useState("details");
  return (
    <div className="text-stone-800 w-full gap-5 flex flex-col md:flex-row sm:px-20 px-2 justify-center py-10">
      <section className="">
        <p className="text-2xl font-semibold underline decoration-primary">Account settings</p>
        <NavBarItem
          title="Details" id="details"
          icon={<AccountIcon className="text-xl"/>}
          setMenu={setMenu} menu={menu} updateHistory={false}
        />
        <NavBarItem
          title="Danger Zone" id="danger"
          icon={<WarningIcon className="text-xl"/>}
          setMenu={setMenu} menu={menu} updateHistory={false}
        />
      </section>
      <div>
        { menu === "details" &&
          <section className="md:w-110 lg:w-105 xl:w-120 w-full rounded-4xl corner-squircle gap-2 flex flex-col p-4 border-stone-200 border">
            <p className="text-sm font-bold">Profile Avatar</p>
            <p className="text-sm">Upload an image or select a generated avatar.</p>
            <div className="flex gap-2 select-none">
              <img src="/pfp.jpeg" className="aspect-square pointer-events-none h-30 w-30 rounded-full ring-2 corner-squircle ring-stone-200"/>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex gap-2">
                  <PrimaryButton title="Upload Icon"/>
                  <PrimaryButton title="Select icon"/>
                </div>
                <p className="text-xs">Supported formats: JPEG, PNG, GIF, WebP</p>
              </div>
            </div>
            <p className="text-sm font-bold">Change your details</p>
            <InputTypeBox title="Username"/>
            <div className="flex gap-2">
              <PrimaryButton fullWidth title="Change email"/>
              <SecondaryButton fullWidth title="Change password"/>
            </div>
          </section>
        }
        { menu === "" &&
          <section className="md:w-110 lg:w-105 xl:w-120 w-full rounded-4xl corner-squircle gap-2 flex flex-col p-4 border-red-600 border">
            <p className="font-mono uppercase text-sm font-bold">Profile Avatar</p>
            <p className="text-sm ">Be aware these actions are <b>PERMANENT</b> and nonrecoverable.</p>
            <SecondaryButton title="Clear all data"/>
            <PrimaryButton title="Delete account and all data."/>
          </section>
        }
        { menu === "danger" &&
          <section className="md:w-110 lg:w-105 xl:w-120 w-full rounded-4xl corner-squircle gap-2 flex flex-col p-4 border-red-600 border">
            <p className="text-sm font-bold text-red-600">Danger zone</p>
            <p className="text-sm ">Be aware these actions are <b>PERMANENT</b> and nonrecoverable.</p>
            <SecondaryButton title="Clear all data"/>
            <PrimaryButton title="Delete account and all data."/>
          </section>
        }
      </div>
    </div>
  )
}