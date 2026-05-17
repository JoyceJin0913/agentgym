import { NextRequest, NextResponse } from "next/server";
import { diaryStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mbti = searchParams.get("mbti");

  let entries = [...diaryStore];

  if (mbti) {
    entries = entries.filter((e) => e.mbti === mbti);
  }

  return NextResponse.json({ entries });
}
