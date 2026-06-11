import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const backendRes = await fetch(`${process.env.BACKEND_URL}/api/v1/docs/self/projects`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  return backendRes
}