import { readdir } from 'fs';

export async function SideBar({duckspace, className, setDuckPage}) {
    const elements = [];
    let directory = "";
    await readdir(`${process.cwd()}/ducky/${duckspace}`, {withFileTypes: true}, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.isDirectory()) {
                directory = file.name
                elements.push(<span className="border-b-2">{file.name}</span>);
            } else if (file.isFile()) {
                if(file.name.includes(".ducky"))
                    elements.push(<span className="ml-3">{file.name}</span>);
            }
        });
    });
    // pages.map(page => {
    //     elements.push(
    //         <div>{page}</div>
    //     )
    // })
    return (
        <nav className={`rounded-lg p-2 bg-white/5 backdrop-blur-lg text-white flex flex-col ${className}`}>
            <p className="border-b-2 text-center text-xl mb-2 pb-2 font-mono">{duckspace}</p>
            {elements}
        </nav>
    )
}