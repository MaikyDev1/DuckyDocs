import useSWR, {mutate} from "swr";
import {fetcher} from "@/app/api/fetcher";
import {ProjectPreview} from "@/app/dashboard/edit/[project]/EditorHelper";
import {BasicPopup, InputTypeBox, PrimaryButton, SecondaryButton} from "papaya";
import {useState} from "react";
import {MoreActionsDots, PlusIcon} from "@/app/FlareUI/FlareIcons";
import {Icon} from "@iconify-icon/react";
import {addNewCategory, changePageDetails, createNewPage} from "@/app/dashboard/edit/[project]/DataProvider";

export function PageLink({selected, icon, title, setPage, page, project, category}) {
  const [editPage, setEditPage] = useState(null);
  return (
    <div>
      {editPage && <EditPage title={title} slug={page} icon={icon} project={project} category={category} page={page} setEditPage={setEditPage}/>}
      <div onClick={() => {
        setPage({category: category, page: page});
      }} className={`flex items-center justify-between p-2 px-3 ${selected && "bg-stone-200"} hover:bg-stone-200 transition duration-200 rounded-full corner-squircle cursor-pointer select-none`}
      >
        <div className="flex items-center gap-2">
          {icon?.startsWith("emoji:") ?
            (<span className="inline-flex h-5 w-5 items-center justify-center text-lg leading-none">{icon.replace("emoji:", "")}</span>) :
            (<Icon icon={icon} height="20"/>)
          }
          <p className="font-normal">{title}</p>
        </div>
        <MoreActionsDots onClick={(e) => {
          document.activeElement.blur();
          e.stopPropagation();
          setEditPage({})
        }} className="p-1 text-2xl hover:bg-stone-400 rounded-full corner-squircle"/>
      </div>
    </div>
  )
}

function EditPage({setEditPage, allowDelete = true, title, slug, icon, page, category, project}) {
  const [error, setError] = useState({});
  const deletePage = async () => {

  }
  const savePage = async () => {
    let temp = {
      name: document.getElementById("title").value,
      slug: document.getElementById("slug").value
    };
    if (temp.name === undefined || temp.name === "") {
      setError({...error, title: "Title is empty"})
      return;
    }
    if (temp.slug === undefined || temp.slug === "") {
      setError({...error, slug: "Slug is empty"})
      return;
    }
    if (page === null)
      createNewPage(project, category, temp.slug, null, temp.name);
    else
      await changePageDetails(project, category, page, temp);
    mutate(["s", project]);
    setEditPage(false);
  }
  return (
    <BasicPopup buttons={[<SecondaryButton key="close" title="Close" onClick={() => setEditPage(false)}/>, <PrimaryButton key="save" title="Save" onClick={() => savePage()}/>]} onClose={() => setEditPage(false)}>
      <p className="uppercase py-2 text-sm font-bold ">Edit page details</p>
      <InputTypeBox title="Page slug" id="slug" error={error.slug} defaultText={slug}/>
      <div className="flex gap-2 ">
        <InputTypeBox title="Page title" id="title" error={error.title} defaultText={title}/>
        <div className="flex flex-col justify-end">
          <PrimaryButton title="Icon"/>
        </div>
      </div>
      {allowDelete && (
        <div>
          <p className="text-red-600 uppercase py-2 text-sm font-bold ">Danger Zone</p>
          <SecondaryButton title="Delete page"/>
        </div>
      )}
    </BasicPopup>
  )
}

function EditCategory({setEditPage, allowDelete = true, title, slug, icon, page, category, project}) {
  const [error, setError] = useState({});
  const deletePage = async () => {

  }
  const savePage = async () => {
    let temp = {
      name: document.getElementById("title").value,
      slug: document.getElementById("slug").value
    };
    if (temp.name === undefined || temp.name === "") {
      setError({...error, title: "Title is empty"})
      return;
    }
    if (temp.slug === undefined || temp.slug === "") {
      setError({...error, slug: "Slug is empty"})
      return;
    }
    addNewCategory(project, temp.slug,null, temp.name);
    mutate(["s", project]);
    setEditPage(false);
  }
  return (
    <BasicPopup buttons={[<SecondaryButton key="close" title="Close" onClick={() => setEditPage(false)}/>, <PrimaryButton key="save" title="Save" onClick={() => savePage()}/>]} onClose={() => setEditPage(false)}>
      <p className="uppercase py-2 text-sm font-bold ">Create a new category</p>
      <InputTypeBox title="Category slug" id="slug" error={error.slug} defaultText={slug}/>
      <div className="flex gap-2 ">
        <InputTypeBox title="Category title" id="title" error={error.title} defaultText={title}/>
        <div className="flex flex-col justify-end">
          <PrimaryButton title="Icon"/>
        </div>
      </div>
      {allowDelete && (
        <div>
          <p className="text-red-600 uppercase py-2 text-sm font-bold ">Danger Zone</p>
          <SecondaryButton title="Delete page"/>
        </div>
      )}
    </BasicPopup>
  )
}

function AddUnderPagePopup({setEditPage, project, category}) {
  const [action, setAction] = useState("none");
  switch (action) {
    case "category":
      return <EditCategory allowDelete={false} setEditPage={setEditPage} project={project}/>
    case "page":
      return <EditPage page={null} allowDelete={false} category={category} project={project} setEditPage={setEditPage}/>
    default:
      return (
        <BasicPopup buttons={<SecondaryButton key="close" title="Close" onClick={() => setEditPage(false)}/>} onClose={() => setEditPage(false)}>
          <p className="uppercase py-2 text-sm font-bold ">Choose what you want to add</p>
          <SecondaryButton onClick={() => setAction("page")} title="New page"/>
          <SecondaryButton onClick={() => setAction("category")} title="New category"/>
        </BasicPopup>
      )
  }
}

export function AddUnderPage({project, category}) {
  const [editPage, setEditPage] = useState(false);
  return (
    <div>
      {editPage && <AddUnderPagePopup project={project} category={category} setEditPage={setEditPage}/>}
      <div onClick={() => setEditPage(true)} className="justify-center items-center flex transition duration-200 bg-stone-100 rounded-full px-5 opacity-0 hover:opacity-100">
        <PlusIcon/>
      </div>
    </div>
  )
}

