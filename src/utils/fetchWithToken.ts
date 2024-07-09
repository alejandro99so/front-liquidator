const fetchWithToken = async (url: string, options: RequestInit) => {
  const jwt = sessionStorage.getItem("jwt");
  console.log({ jwt });

  if (!jwt) throw new Error("Token is missing");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server response:", errorText);
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export default fetchWithToken;
