"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import Link from "next/link";
import { Button } from "./ui/button";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpLoad from "./ImageUpLoad";
import { authClient } from "@/lib/authClient";
import { useState } from "react";
import { Loader2, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema, signUpSchema } from "@/lib/validations";
import { workflowClient } from "@/lib/workflow";
import { signIn, signUp } from "@/actions/authActions";

interface Props {
  type: "SIGN_IN" | "SIGN_UP";
}
const AuthForm = ({ type }: Props) => {
  const isSignIn = type === "SIGN_IN";
  const schema = type === "SIGN_IN" ? signInSchema : signUpSchema;
  const defaultValues =
    type === "SIGN_IN"
      ? { email: "", password: "" }
      : {
          fullName: "",
          email: "",
          password: "",
          universityId: 0,
          universityCard: "",
        };
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  type T = z.infer<typeof schema>;
  const { toast } = useToast();
  const router = useRouter();
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsLoading(true);
    try {
      if (isSignIn) {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response.status === 200) {
          router.push("/");
        } else {
          toast({
            title: response.message,
            variant: "destructive",
          });
          setIsLoading(false);
        }
        // await authClient.signIn.email(
        //   {
        //     email: data.email,
        //     password: data.password,
        //     callbackURL: "/",
        //   },
        //   {
        //     onRequest: (ctx) => {
        //       setIsLoading(true);
        //     },
        //     onSuccess: (ctx) => {
        //       router.push("/");
        //     },
        //     onError: (ctx) => {
        //       toast({
        //         title: "Failed to sign up",
        //         variant: "destructive",
        //       });
        //       setIsLoading(false);
        //     },
        //   }
        // );
      } else {
        const response = await signUp({
          name: data.fullName,
          email: data.email,
          password: data.password,
          universityId: data.universityId,
          universityCard: data.universityCard,
        });
        if (response.status === 200) {
          router.push("/sign-in");
        } else {
          toast({
            title: response.message,
            variant: "destructive",
          });
          setIsLoading(false);
        }
        // authClient.signUp.email(
        //   {
        //     name: data.fullName,
        //     email: data.email,
        //     password: data.password,
        //     universityId: data.universityId,
        //     universityCard: data.universityCard,
        //     callbackURL: "/sign-in",
        //   },
        //   {
        //     onRequest: (ctx) => {
        //       console.log(ctx);
        //       setIsLoading(true);
        //     },
        //     onSuccess: (ctx) => {
        //       console.log(ctx);
        //       // await workflowClient.trigger({});
        //       setIsLoading(false);
        //       router.push("/sign-in");
        //     },
        //     onError: (ctx) => {
        //       toast({
        //         title: ctx.error.message,
        //         variant: "destructive",
        //       });
        //       setIsLoading(false);
        //     },
        //   }
        // );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
          noValidate
        >
          {Object.keys(defaultValues).map((field, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <ImageUpLoad onFileChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="form-btn" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" size={40} />}
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <hr />
      <p className="flex justify-center items-center">OR</p>
      <div>
        <Button
          className="form-btn"
          onClick={async () => {
            await authClient.signIn.social(
              {
                provider: "github",
                callbackURL: "/",
              },
              {
                onRequest: (ctx) => {
                  setIsLoadingSocial(true);
                },
                onError: (ctx) => {
                  toast({
                    title: ctx.error.message,
                    variant: "destructive",
                  });
                  setIsLoadingSocial(false);
                },
              }
            );
          }}
        >
          {isLoadingSocial ? (
            <>
              <Loader2 className="animate-spin" size={40} />
              Github...
            </>
          ) : (
            <>
              <Github size={36} />
              Github
            </>
          )}
        </Button>
      </div>
      <div>
        <p className="text-center text-base font-medium">
          {isSignIn ? "New to BookWise" : "Already have an account"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-primary"
          >
            {isSignIn ? " Create an account" : " Sign in"}
          </Link>
        </p>
        {isSignIn && (
          <p className="flex justify-center items-center">
            <Link href={"/forgot-password"} className="underline">
              forgot your password ?
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
