import { createServerComponentClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServerComponentClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
