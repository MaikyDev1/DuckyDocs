import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {sendRequestToBackend} from "@/app/api/ApiUtils";

export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  return sendRequestToBackend({
    needAuthorization: true,
    jwt: token,
    endpoint: "docs/self/get/project?tag_line=it-test"
  })
}