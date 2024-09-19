export function CodeFailed({reason}) {
    return (
        <section className="h-screen w-screen bg-neutral-950/80 backdrop-blur-2xl absolute z-10 top-0 left-0 overflow-hidden">
            <div className="flex justify-center items-center h-screen w-screen">
                <div className="w-[40%] h-[50%] bg-red-800/40 rounded-2xl border-rose-400 border">
                    {reason}
                </div>
            </div>
        </section>
    )
}