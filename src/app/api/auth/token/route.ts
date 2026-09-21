import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value ?? null;

  return Response.json({ token });
}
