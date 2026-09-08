class ApiError extends Error {
  status: number;
  code?: string;
  data?: unknown;

  constructor(message: string, status: number, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get requiresMeetingConfirmation(): boolean {
    if (this.data && typeof this.data === "object") {
      const obj = this.data as Record<string, unknown>;
      if (obj.requires_meeting_confirmation === true) return true;
      if (typeof obj.message === "string" && obj.message.includes("MEETING_CONFIRMATION_REQUIRED")) return true;
    }
    return this.message.includes("MEETING_CONFIRMATION_REQUIRED");
  }
}

function getErrorMessage(status: number, data: unknown): string {
  if (status === 429) {
    return "You're making requests too quickly. Please wait a moment and try again.";
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    const raw = obj.message;
    const msg = Array.isArray(raw) ? raw.join(", ") : typeof raw === "string" ? raw : null;

    if (msg) {
      if (status === 401) {
        if (msg.toLowerCase().includes("disabled")) {
          return "Your account has been disabled. Please contact the administrator.";
        }
        return "Invalid email or password.";
      }
      if (status === 403) return "You do not have permission to perform this action.";
      if (status === 404) return "The requested resource was not found.";
      if (status === 409) return msg;
      return msg;
    }
  }

  if (status === 0 || status === -1) return "Unable to reach the server. Please check your connection.";
  if (status === 401) return "Invalid email or password.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status >= 500) return "Something went wrong on our end. Please try again later.";
  return "An unexpected error occurred. Please try again.";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type") && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(path, { headers, ...rest });
  } catch {
    throw new ApiError("Unable to reach the server. Please check your connection.", 0);
  }

  const contentType = res.headers.get("content-type") ?? "";
  let data: unknown = null;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message = getErrorMessage(res.status, data);
    const code =
      data && typeof data === "object" && "statusCode" in data
        ? String((data as Record<string, unknown>).statusCode)
        : undefined;
    throw new ApiError(message, res.status, code, data);
  }

  return data as T;
}

export function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, { method: "GET", ...init });
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

export function apiPut<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

export function apiPatch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

export function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, { method: "DELETE", ...init });
}

export { ApiError };
