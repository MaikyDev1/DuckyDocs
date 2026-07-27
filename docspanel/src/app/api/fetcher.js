export const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server");
  }

  if (!res.ok) {
    const error = new Error(data.error || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }

  return data;
};