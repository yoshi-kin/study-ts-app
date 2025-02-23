"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <>
      <form
        action={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                console.log("Signed out");
                router.push("/sign-in");
              },
            },
          });
        }}
      >
        <Button type="submit">Logout</Button>
      </form>
    </>
  );
};

export default Page;
