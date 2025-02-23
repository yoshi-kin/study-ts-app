import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/auth";
export const metadata: Metadata = {
  title: "BookWise",
  description:
    "BookWise is a book borrowing university library management solution.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  // const session = await auth();

  return (
    <html lang="en">
      {/* <SessionProvider session={session}> */}
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
      {/* </SessionProvider> */}
    </html>
  );
};

export default RootLayout;
