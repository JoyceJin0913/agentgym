import { NextRequest, NextResponse } from "next/server";
import { diaryStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  const entry = diaryStore.find((e) => e.id === id);
  if (!entry) {
    return NextResponse.json({ error: "日记不存在" }, { status: 404 });
  }

  entry.likes += 1;
  return NextResponse.json({ id: entry.id, likes: entry.likes });
}
