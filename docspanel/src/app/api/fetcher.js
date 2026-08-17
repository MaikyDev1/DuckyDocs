export const fetcher = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    window.location.assign("/account/login");
    return;
  }

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