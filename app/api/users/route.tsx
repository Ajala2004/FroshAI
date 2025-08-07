import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.primaryEmailAddress) {
    return NextResponse.json({ error: "Unauthorized or incomplete user data" }, { status: 401 });
  }
 
  const email = user.primaryEmailAddress.emailAddress;
  const fullName = user.fullName ?? "Unnamed User";


  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (users.length === 0) {
      const result = await db.insert(usersTable).values({
        name: fullName,
        email,
        credits: 10,
      }).returning();

      return NextResponse.json({ user: result[0] });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
