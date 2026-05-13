import { NextResponse } from "next/server";

import { getJobById } from "@/lib/data";

export async function GET(
  _request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  const { id } = await segmentData.params;
  const job = await getJobById(id);
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(job);
}
