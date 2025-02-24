import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { getServerSession } from "@/actions/getServerSession";
import { after } from "next/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  after(async () => {
    if (!session?.user?.id) return;
    const lastActivityDate = session.user.lastActivityDate;
    if (lastActivityDate === new Date().toISOString().slice(0, 10)) return;
    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
