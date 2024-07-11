type IHeader = {
  "Content-Type": string;
  Authorization?: string;
};
export const bucksPost = async (
  path: string,
  body: object,
  token: boolean = true
) => {
  const jwt = sessionStorage.getItem("jwt");
  console.log({ jwt });

  if (!jwt) throw new Error("Token is missing");
  const baseUrl =
    process.env.NEXT_PUBLIC_STAGE == "dev"
      ? "http://localhost:3000"
      : "https://apiv1.buckspay.xyz";

  let headers: IHeader = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${jwt}`;
  console.log({ data: `${baseUrl}/${path}`, headers, body });
  const response = await fetch(`${baseUrl}/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  console.log({ response });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server response:", errorText);
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const bucksGet = async (path: string, token: boolean = true) => {
  const jwt = sessionStorage.getItem("jwt");
  console.log({ jwt });

  if (!jwt) throw new Error("Token is missing");
  const baseUrl =
    process.env.NEXT_PUBLIC_STAGE == "dev"
      ? "http://localhost:3000"
      : "https://apiv1.buckspay.xyz";

  let headers: IHeader = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${jwt}`;
  const response = await fetch(`${baseUrl}/${path}`, {
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server response:", errorText);
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const bucksPatch = async (path: string, token: boolean = true) => {
  const jwt = sessionStorage.getItem("jwt");
  console.log({ jwt });

  if (!jwt) throw new Error("Token is missing");
  const baseUrl =
    process.env.NEXT_PUBLIC_STAGE == "dev"
      ? "http://localhost:3000"
      : "https://apiv1.buckspay.xyz";

  let headers: IHeader = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${jwt}`;
  const response = await fetch(`${baseUrl}/${path}`, {
    method: "PATCH",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server response:", errorText);
    throw new Error("Network response was not ok");
  }

  return response.json();
};
