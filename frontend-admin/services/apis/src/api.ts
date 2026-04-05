const ENHANCED_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_PATH_1
    : process.env.NEXT_PUBLIC_PATH_2;

export const BASE_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL
    : ENHANCED_URL;
