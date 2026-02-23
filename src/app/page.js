import Image from "next/image";
import {DuckyMagic} from "@/app/service/JsonDuckyParser";

export default async function Home() {
  const html = await DuckyMagic({file: 'poo.json'});
  return (
      <main className="md:px-32 px-2 h-screen overflow-auto text-[#E0D7F6] bg-stone-800 pt-10">
            {html}
      </main>
  );
}
