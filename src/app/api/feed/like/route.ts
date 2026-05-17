import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  // 先获取当前 likes
  const { data: entry, error: fetchError } = await supabase
    .from("diary_entries")
    .select("id, likes")
    .eq("id", id)
    .single();

  if (fetchError || !entry) {
    return NextResponse.json({ error: "日记不存在" }, { status: 404 });
  }

  const newLikes = (entry.likes || 0) + 1;

  const { error: updateError } = await supabase
    .from("diary_entries")
    .update({ likes: newLikes })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ id, likes: newLikes });
}
