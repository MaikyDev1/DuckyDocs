'use client'

import {LightningIcon} from "@/app/FlareUI/FlareIcons";
import {InputTypeBoxWhite} from "@/app/FlareUI/Basic/InteractiveFields";
import {StoneButton} from "@/app/FlareUI/Basic/Buttons";
import Link from "next/dist/client/link";
import { Turnstile, useTurnstile } from "react-turnstile";
import Image from "next/image";
import {useState} from "react";

export default function Page({backLink}) {
  const turnstile = useTurnstile();
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const validateAndPost = (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    if (password.length < 8) {
      setError({password: "Password should be 8 chars min"})
      return;
    }
    const payload = {
      email: email,
      password: password,
      cloudflare_token: token
    }
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    };

    fetch('/api/login', options)
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Unexpected response from server");
        }
        if (!res.ok || data.success !== true) {
          throw new Error(data.error || `Login failed (${res.status})`);
        }
        return data;
      })
      .then(() => {
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <main className="bg-stone-900 select-none flex flex-col h-screen w-screen p-3 justify-center items-center">
      <Image className="pointer-events-none absolute top-2 left-2" src="/DuckyDocsLogo.svg" alt="logo" height="30" width="140"/>
      <div className="bg-stone-100 drop-shadow-2xl w-full p-5 rounded-2xl md:w-1/2 xl:w-1/3 2xl:w-1/4 ">
        <form className="p-4 text-stone-700 col-span-3" id="register" onSubmit={validateAndPost}>
          <div className="flex mb-3 gap-1">
            <LightningIcon className="text-orange-400 text-3xl"/>
            <p className="text-xl font-bold text-stone-700">Access your account</p>
          </div>
          <p className="text-xs font-bold text-stone-700">Start using our documentation engine by logining to your
            account.</p>
          <div className="mt-4">
            <InputTypeBoxWhite title="Email" id="email" error={error ? error.email : null}/>
            <InputTypeBoxWhite title="Password" id="password" error={error ? error.password : null}/>
            <p className="text-right text-sm cursor-pointer">Forgot Password?</p>
          </div>
          <div className="py-2">
            <Turnstile
              sitekey="1x00000000000000000000AA"
              size="flexible"
              onVerify={(token) => { setToken(token); }}
            />
          </div>
          <p className="text-sm">No account? <Link className="text-orange-400" href="/account/register">Register here</Link></p>
          <div className="flex flex-col mt-1">
            <StoneButton title="Login" type="submit"/>
          </div>
        </form>
      </div>
      <p className="w-full p-3 rounded-2xl lg:w-1/5 text-center text-stone-500 text-sm">By continuing, I agree to DuckyDocs privacy policy, teams of service, and cookie policy.</p>
    </main>
  )
}