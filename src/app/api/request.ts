import { NextApiRequest, NextApiResponse } from "next";

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization;
  console.log("Authorization token received:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await fetch("http://localhost:3000/room/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    console.log("Response status:", response.status);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      const text = await response.text();
      console.error("Unexpected response:", text);
      return res
        .status(response.status)
        .json({ message: "Server error", error: text });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default request;
