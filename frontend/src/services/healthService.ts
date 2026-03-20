const baseUrl = import.meta.env.VITE_BACKEND_SERVICE;

export default async function getHealth() {
  const relativeUrl = "/health";
  const requestUrl = baseUrl + relativeUrl;

  const response = await fetch(requestUrl, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return response.json();
}
