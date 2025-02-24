"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <>
      <form
        action={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                toast({ title: "Signed out" });
                router.push("/sign-in");
              },
              onError: () => {
                toast({ title: "Failed to sign out", variant: "destructive" });
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
