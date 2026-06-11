import {NextResponse} from "next/server";

export async function sendRequestToBackend({needAuthorization = false, jwt, endpoint, body, method = "GET"}) {
  if (!jwt && needAuthorization) {
    return NextResponse.json(
      {error: "Unauthorized"},
      {status: 401}
    );
  }
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (needAuthorization) {
    headers.append("authorization", `Bearer ${jwt}`);
  }
  const response = await fetch(`${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/${endpoint}`, {
    method: method.toUpperCase(),
    headers: headers,
    body: body ? JSON.stringify(body) : null
  })
  const data = await response.json();
  console.log(response.body);
  if (!response.ok)
    return NextResponse.json(
      response.body ? response.body : {error: response.statusText}, {status: response.status ? response.status : 400}
    )
  if (data) {
    return NextResponse.json(data);
  }
}