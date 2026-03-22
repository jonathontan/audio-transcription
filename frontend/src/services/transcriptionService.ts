const baseUrl = import.meta.env.VITE_BACKEND_SERVICE;

export async function transcribe(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const relativeUrl = "/transcribe";
  const requestUrl = baseUrl + relativeUrl;

  const response = await fetch(requestUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail);
  }

  return response.json();
}

export async function getTranscriptions() {
  const relativeUrl = "/transcriptions";
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

export async function deleteTranscription(id: number) {
  const relativeUrl = `/${id}`;
  const requestUrl = baseUrl + relativeUrl;

  const response = await fetch(requestUrl, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return response.json();
}
