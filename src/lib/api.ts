class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);
  if (
    !headers.has("Content-Type") &&
    !(rest.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, { headers, ...rest });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const code = data?.statusCode
      ? String(data.statusCode)
      : undefined;
    const message =
      data?.message ?? `Request failed with status ${res.status}`;
    const err = new ApiError(
      Array.isArray(message) ? message.join(", ") : message,
      res.status,
      code,
    );
    throw err;
  }

  return data as T;
}

export function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, { method: "GET", ...init });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

export function apiPut<T>(
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

export function apiDelete<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  return request<T>(path, { method: "DELETE", ...init });
}

export { ApiError };
