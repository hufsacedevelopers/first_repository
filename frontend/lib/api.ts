import { Company, Job } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  } catch (error) {
    throw new Error(`API fetch failed: ${path} (${BASE_URL})`, { cause: error });
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  companies: () => get<Company[]>("/companies"),
  jobs: () => get<Job[]>("/jobs"),
};
