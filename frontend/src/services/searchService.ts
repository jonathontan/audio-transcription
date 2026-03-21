const baseUrl = import.meta.env.VITE_BACKEND_SERVICE;

export default async function searchTranscriptions(text: string) {
  const relativeUrl = "/search";
  const params = "?filename=" + text;
  const requestUrl = baseUrl + relativeUrl + params;

  const response = await fetch(requestUrl, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return response.json();
}