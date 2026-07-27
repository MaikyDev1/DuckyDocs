const BACKEND_URL = process.env.BACKEND_URL;

async function forward(req, pathSegments) {
  if (!BACKEND_URL) {
    return new Response(JSON.stringify({ error: "BACKEND_URL not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const targetUrl = `${BACKEND_URL}/api/${pathSegments.join("/")}${req.nextUrl.search}`;
  console.log(targetUrl)
  const headers = new Headers(req.headers);
  headers.delete("host");

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("set-cookie");

  const nextResponse = new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });

  const setCookies = response.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    nextResponse.headers.append("set-cookie", cookie);
  }

  return nextResponse;
}

export async function GET(req, { params }) {
  const { path } = await params;
  return forward(req, path);
}
export async function POST(req, { params }) {
  const { path } = await params;
  return forward(req, path);
}
export async function PUT(req, { params }) {
  const { path } = await params;
  return forward(req, path);
}
export async function DELETE(req, { params }) {
  const { path } = await params;
  return forward(req, path);
}
export async function PATCH(req, { params }) {
  const { path } = await params;
  return forward(req, path);
}