import {NextResponse} from "next/server";

/**
 *
 * @param request
 * @returns {Promise<NextResponse<{success: boolean}>>}
 * @constructor
 */
export async function POST(request) {
  const body = await request.json();
  const backendRes = await fetch(`${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await backendRes.json()
  return NextResponse.json(data)
}