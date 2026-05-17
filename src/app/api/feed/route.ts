import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mbti = searchParams.get("mbti");

  let query = supabase
    .from("diary_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (mbti) {
    query = query.eq("mbti", mbti);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}
