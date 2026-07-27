'use client'

import useSWR from "swr";
import {fetcher} from "../api/fetcher";

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR("/api/v1/account/details", fetcher);
  if (isLoading) return (<main>Loging...</main>)
  if (error) return (<main>{JSON.stringify(error)}</main>)
  return (
    <main>
      <div>{JSON.stringify(data)}</div>
    </main>
  )
}