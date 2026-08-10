function Popup({children, state, onClose}) {
  if (!state)
    return null;
  return (
    <section onClick={(e) => {e.stopPropagation(); onClose()}} className="absolute top-0 left-0 h-screen flex justify-center items-center w-screen bg-white/5 backdrop-blur-[1px]">
      <div onClick={(e) => e.stopPropagation()} className="w-3/12 p-2 flex gap-1 flex-col rounded-2xl justify-center bg-stone-800">
        {children}
      </div>
    </section>
  )
}