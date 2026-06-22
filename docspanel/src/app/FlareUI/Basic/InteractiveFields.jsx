import React from "react";

export function InputTypeBox({id, type, title, onChange, name, placeholder, autoFocus = false, defaultValue, error}) {
    return (
        <div className="w-full">
            {title ?
                <label className="block uppercase tracking-wide text-stone-300 text-xs font-bold mb-2" htmlFor={id}>
                    {title}
                </label> : null}
            <input autoFocus={autoFocus} onChange={onChange} name={name} className={(error ? "ring-2 ring-rose-600 text-rose-600 " : "focus:ring-2 focus:ring-amber-400  mb-2") + " appearance-none outline-none bg-stone-700 text-stone-300 w-full rounded py-2 px-3"}
                   id={id} type={type ? type : "text"} placeholder={placeholder} defaultValue={defaultValue}/>
            {error ?
                <p className="text-red text-xs italic mt-1 text-rose-600">{error}</p> : null}
        </div>
    )
}

export function InputTypeBoxWhite({id, type, title, onChange, name, placeholder, defaultValue, error}) {
  return (
    <div className="w-full">
      {title ?
        <label className="block uppercase tracking-wide text-stone-700 text-xs font-bold mb-2" htmlFor={id}>
          {title}
        </label> : null}
      <input onChange={onChange} name={name} className={(error ? "ring-2 ring-rose-600 text-rose-600 " : "focus:ring-2 focus:ring-amber-400 mb-2") + " appearance-none outline-none  w-full bg-stone-700/10 rounded py-2 px-3"}
             id={id} type={type ? type : "text"} placeholder={placeholder} defaultValue={defaultValue}/>
      {error ?
        <p className="text-red text-xs italic mt-1 text-rose-600">{error}</p> : null}
    </div>
  )
}

export function SelectTypeBox ({id, title, defaultValue, children, onChange}) {
    return (
        <div className="w-full">
            <label className="block uppercase tracking-wide text-stone-300 text-xs font-bold mb-2" htmlFor={id}>
                {title}
            </label>
            <select
                onChange={onChange}
                defaultValue={defaultValue}
                className="appearance-none outline-none bg-stone-700 focus:ring-2 focus:ring-amber-400 w-full rounded py-2 px-3 mb-3"
                id={id}>
                {children}
            </select>
        </div>
    )
}

export function SelectItem({value, text, checked}) {
    return <option value={value} defaultChecked={checked}>{text}</option>
}