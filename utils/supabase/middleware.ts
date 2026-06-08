import { type NextRequest, NextResponse } from "next/server";

// Middleware helper - returns next response
// Session refresh handled client-side via @supabase/ssr browser client
export const createClient = (_request: NextRequest) => {
  return NextResponse.next();
};
