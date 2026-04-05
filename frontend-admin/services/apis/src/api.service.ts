// API
import { BASE_URL } from "./api";
// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";
// Service Handlers
import { ErrorResponseHandlerService } from "@/services/handlers";

export class ApiService {
  public async UseApi<P>({
    url,
    method = "GET",
    params,
    headers,
    body,
  }: UseApiI<P>) {
    let token: string | null = null;
    let queries = null;
    let id = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem(process.env.NEXT_PUBLIC_ST_KEY!);
    }

    if (params?.query) {
      const searchParams = new URLSearchParams(params.query);
      queries = `?${searchParams.toString()}`;
    }

    if (params?.id) {
      id = params.id;
    }

    const sanitizedUrl = url.startsWith("/") ? `${url.replace("/", "")}` : url;

    const query = queries !== null ? queries : "";
    const paramId = id !== null ? `/${id}` : "";

    const completeUrl = `${BASE_URL}/${sanitizedUrl}${paramId}${query}`;

    const response = await fetch(completeUrl, {
      method,
      ...(headers
        ? { headers }
        : {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      if (
        typeof window !== "undefined" &&
        response.status === 401 &&
        token !== null
      ) {
        localStorage.removeItem(process.env.NEXT_PUBLIC_ST_KEY!);
        window.location.href = "/admin/login";
      }

      return new ErrorResponseHandlerService(
        response.status,
        method,
        response.statusText,
        url,
      );
    }

    if (
      typeof window !== "undefined" &&
      window.location.href.includes("/login")
    ) {
      window.location.href = "/admin/";
    }

    return response.json();
  }
}

interface UseApiI<P> {
  url: string;
  method: HTTP_METHOD;
  params?: {
    id?: string;
    query?: any;
  };
  headers?: HeadersInit;
  body?: P;
}
