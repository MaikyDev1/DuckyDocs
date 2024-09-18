import Image from "next/image";
import DuckyMagic from "@/app/service/DuckyParser";

export default async function Home() {
  const html = await DuckyMagic({file: 'example.ducky'});
  return (
      <main className="bg-neutral-950 h-screen px-32 pt-10">
        {html}
      </main>
  );
}
