import {BasicPopup, InputTypeBox, PrimaryButton, SecondaryButton} from "papaya";
import {useState} from "react";
import {fetcher} from "@/app/api/fetcher";
import {mutate} from "swr";

export function CreateNewProject({setPopup, onClose}) {
  const [error, setError] = useState({});
  const process = async () => {
    const name = document.getElementById("name").value;
    const slug = document.getElementById("slug").value;
    if (!name || !slug) {
      setError({
        name: (!name && "Name is not valid!"),
        slug: (!slug && "Slug is not valid!")
      })
      return;
    }
    const payload = {
      name: name, slug: slug
    }
    const res = await fetcher("/api/v1/docs/writer/new", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (res.error) {
      alert(res.error);
    } else {
      onClose();
      mutate("/api/v1/documents/projects");
    }
  }
  return (
    <BasicPopup onClose={onClose} buttons={[<SecondaryButton onClick={onClose} key="close" title="Close"/>,
    <PrimaryButton title="Create" key="create" onClick={process}/>]}>
      <p className="uppercase py-2 text-sm font-bold ">Create a new project</p>
      <InputTypeBox error={error.name} id="name" title="Project name"/>
      <InputTypeBox error={error.slug} id="slug" title="Slug"/>
    </BasicPopup>
  );
}