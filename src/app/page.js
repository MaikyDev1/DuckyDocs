import Image from "next/image";
import DuckyMagic from "@/app/service/DuckyParser";

export default async function Home() {
  const html = await DuckyMagic({file: 'example.ducky'});
  return (
      <main>
        {html}
      </main>
  );
}
