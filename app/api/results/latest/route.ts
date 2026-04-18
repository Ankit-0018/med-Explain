import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("processed_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching latest result:", error);
      }
      return NextResponse.json(null);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/results/latest] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
