export function BlackButton({title, icon, onClick}) {
  return (
    <button onClick={onClick} type="button" className="cursor-pointer shadow hover:scale-[1.01] py-2 flex items-center justify-center bg-black rounded-2xl">
      <p className="text-white">{title}</p>
      {icon}
    </button>
  )
}

export function GrayButton({title, icon, onClick}) {
  return (
    <button onClick={onClick} type="button" className="cursor-pointer shadow hover:scale-[1.01] px-3 py-1 flex items-center justify-center bg-stone-600 rounded-lg">
      <p className="text-stone-200">{title}</p>
      {icon}
    </button>
  )
}

export function FadeOrangeButton({title, icon, onClick}) {
  return (
    <button onClick={onClick} type="button" className="cursor-pointer shadow hover:scale-[1.01] px-3 py-1 flex items-center justify-center bg-orange-fade rounded-lg">
      <p className="text-stone-800">{title}</p>
      {icon}
    </button>
  )
}

export function StoneButton({title, type, icon, onClick}) {
  return (
    <button onClick={onClick} type={!type ? "button" : type} className="cursor-pointer px-5 shadow hover:scale-[1.01] py-2 flex items-center justify-center bg-stone-600 rounded-lg">
      <p className="text-stone-200">{title}</p>
      {icon}
    </button>
  )
}

export function WhiteButton({title, icon, onClick}) {
  return (
    <button onClick={onClick} type="button" className="cursor-pointer px-5 shadow hover:scale-[1.01] py-2 flex items-center justify-center bg-stone-200 rounded-2xl">
      <p className="text-stone-900 font-semibold">{title}</p>
      {icon}
    </button>
  )
}