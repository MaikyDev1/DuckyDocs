import { promises as fs } from 'fs';
import {SideBar} from "@/app/components/DuckSpaceElements";
import DuckyMagic from "@/app/service/DuckyParser";

export default async function Page({params}) {
    const duckspace = params.duckspace;
    const config = await JSON.parse(await fs.readFile(`${process.cwd()}/ducky/${duckspace}/config.json`, 'utf8'));
    const html = await DuckyMagic({file: `${duckspace}/main.ducky`});
    return (
        <main className="grid grid-cols-12 p-2 h-screen" style={{
            backgroundImage: "radial-gradient(at 6% 83%, hsla(263,3%,6%,1) 0px, transparent 50%),\n" +
                "radial-gradient(at 91% 1%, hsla(240,35%,11%,1) 0px, transparent 50%)",
            backgroundColor: "hsla(312,0%,3%,1)"
        }}>
            {config.showSideBar ?
                <SideBar className="col-span-2 mr-2" duckspace={duckspace}/> :
                <div className="col-span-1"/>
            }
            <div className="border-2 border-black/20 bg-neutral-700/20 p-3 scroll-smooth saturate-150 backdrop-blur-lg col-span-10 rounded-lg overflow-x-auto">
                {html}
            </div>
        </main>
    )
}