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
    isMultipart = false,
  }: UseApiI<P>) {
    try {
      let token: string | null = null;
      let queries = null;
      let id = null;
      let payload: BodyInit | undefined;

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

      const query = queries !== null ? queries : "";
      const paramId = id !== null ? id : "";

      const sanitizedUrl = url.startsWith("/")
        ? `${url.replace("/", "")}`
        : url;

      const completeUrl = `${BASE_URL}/${paramId !== null ? sanitizedUrl.replace(":id", paramId) : sanitizedUrl}${query}`;

      // if (body instanceof FormData) {
      //   payload = body;
      // } else if (body) {
      //   payload = JSON.stringify(body);
      // }

      if (!isMultipart && body) {
        payload = JSON.stringify(body);
      }

      if (isMultipart && body instanceof FormData) {
        payload = body as FormData;
      }

      const response = await fetch(completeUrl, {
        method,
        headers,
        ...(payload ? { body: payload } : {}),
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
    } catch (error: any) {
      console.error("ERROR FOUND HERE: API SERVICE:", error);
      if (
        typeof window !== "undefined" &&
        !window.location.href.includes("/login")
      ) {
        localStorage.removeItem(process.env.NEXT_PUBLIC_ST_KEY!);
        window.location.href = "/admin/login";
      }
      if (error instanceof TypeError) {
        return new ErrorResponseHandlerService(
          500,
          method,
          error?.message,
          url,
        );
      }
    }
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
  isMultipart?: boolean;
}
