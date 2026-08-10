'use client'

import {useEffect, useState} from "react";
import {applyFormation, ObjectToHtml} from "@/app/service/JsonDuckyParser";
import {EditIcon, PlusIcon, TrashIcon} from "@/app/components/IconsDB";
import {RenderContentArray} from "@/app/editor/ContentRenderer";

export default function Home() {
  const [content, setContent] = useState([
    {id: 1, element: {type: "p", content: "First element"}},
    {id: 2, element: {type: "p", content: "Test"}},
    {id: 3, element: {type: "p", content: "Divider"}},
    {id: 4, element: {type: "expand", title: "Test", content: [
          {id: 5, element: {type: "p", content: "INSIDEEE"}},
          {id: 6, element: {type: "p", content: "INSIDEEE1"}},
          {id: 7, element: {type: "p", content: "INSIDEEE2"}}
        ]}},
  ]);
  const addNewElement = (element) => {
    setContent(prev => [...prev, {id: prev[prev.length - 1].id + 1, element: element}]);
  }
  const removeElement = (idToRemove) => {
    const removeRecursive = (items) => {
      return items
        .filter(item => item.id !== idToRemove)
        .map(item => {
          if (item.element?.content && Array.isArray(item.element.content)) {
            return {
              ...item,
              element: {
                ...item.element,
                content: removeRecursive(item.element.content)
              }
            };
          }
          return item;
        });
    };
    setContent(prev => removeRecursive(prev));
  };
  const updateElement = (id, element) => {

  }
  return (
    <main className="md:px-32 px-2 h-screen overflow-auto text-[#E0D7F6] bg-stone-800 pt-10">
      <RenderContentArray content={content} removeElement={removeElement}/>
    </main>
  );
}

function AddNewElement({addElementFunction}) {
  const [clicked, setClicked] = useState(false);
  return (
    <div onClick={() => setClicked(true)} className="flex cursor-pointer p-2 items-center text-white gap-1">
      {clicked ? <ElementsList addElementFunction={addElementFunction} setClicked={setClicked}/> : null}
      <div className="p-2 rounded text-stone-800 bg-white">
        <PlusIcon/>
      </div>
      Add new element
    </div>
  )
}

function ElementsList({setClicked, addElementFunction}) {
  return (
    <section onClick={(e) => {e.stopPropagation(); setClicked(false)}} className="absolute top-0 left-0 h-screen flex justify-center items-center w-screen bg-white/5 backdrop-blur-[1px]">
      <div onClick={(e) => e.stopPropagation()} className="w-3/12 p-2 flex gap-1 flex-col rounded-2xl justify-center bg-stone-800">
        <p className="text-center">Select an element</p>
        <div onClick={
          () => addElementFunction({type: "p", content: "New element"})
        } className="p-1 bg-stone-700 rounded">
          Simple text
        </div>
        <div onClick={
          () => addElementFunction({type: "divider", space: 20, size: 4})
        } className="p-1 bg-stone-700 rounded">
          Divider
        </div>
        <div onClick={
          () => addElementFunction({type: "break"})
        } className="p-1 bg-stone-700 rounded">
          Break
        </div>
        <div onClick={
          () => addElementFunction({type: "code", code: "test"})
        } className="p-1 bg-stone-700 rounded">
          Code
        </div>
      </div>
    </section>
  )
}