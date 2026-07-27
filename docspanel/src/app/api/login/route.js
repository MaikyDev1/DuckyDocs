const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req) {
  if (!BACKEND_URL) {
    return new Response(JSON.stringify({ error: "BACKEND_URL not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const body = await req.arrayBuffer();

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/account/login`, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") ?? "application/json",
    },
    body,
    redirect: "manual",
  });

  const responseBody = await backendRes.arrayBuffer();
  const nextResponse = new Response(responseBody, {
    status: backendRes.status,
  });
  console.log(nextResponse)

  const setCookies = backendRes.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    nextResponse.headers.append("set-cookie", cookie);
  }

  const contentType = backendRes.headers.get("content-type");
  if (contentType) nextResponse.headers.set("content-type", contentType);

  console.log("Final response status:", nextResponse.status);
  console.log("Final response headers:", [...nextResponse.headers.entries()]);

  return nextResponse;
}