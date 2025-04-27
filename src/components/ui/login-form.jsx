"use client";


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFetch } from "@/lib/hooks/useFetch";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { useContext, useState } from "react";
import { userContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

const baseSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = baseSchema.extend({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  picture: z.any().refine((files) => files.length === 0 || files.length === 1, {
    message: 'You must upload exactly one image.',
  })
    .refine((files) => {
      return files.length === 0 || files[0].type.startsWith('image/');
    }, {
      message: 'Please upload a valid image file.',
    })
    .refine((files) => files.length > 0, {
      message: 'Photo is required',
    }),
});

export function AuthForm({ className, type = "signin", ...props }) {
  const isSignup = type === "signup";
  const authUrl = isSignup ? "/api/auth/register" : "/api/auth/login";
  const { setUser } = useContext(userContext)
  const { loading, error, data, refetch } = useFetch(authUrl, {}, false);
  const router = useRouter();
  const formSchema = isSignup ? signupSchema : baseSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formValues) => {

    const formData = new FormData();
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);
    if (isSignup) {
      formData.append("name", formValues.name);
      formData.append("username", formValues.username);
      formData.append("picture", formValues.picture[0]);
    }


    const result = await refetch({
      method: "POST",
      body: formData,
    });

    if (result.success) {
      localStorage.setItem('jwttoken', result.data.jwttoken);
      setUser(result.data.user);
      router.push('/onboarding');
      console.log("result:",result);
      if (isSignup) {
        toast.success("Registration successful. Please check your email for verification.");
      } else {
        toast.success("Login successful. Welcome back!");
      }
    } else {
      toast.error(result.message)
    }
  }




  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">
          {isSignup ? "Register for" : "Login to"} your account
        </h1>
        <p className="text-balance text-xs text-muted-foreground">
          Enter your email below to {isSignup ? "sign up" : "sign in"} to your account
        </p>
      </div>

      <div className="grid gap-5">
        {isSignup && (
          <>
            <div className="grid gap-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="wrong.one_" {...register("username")} />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>
          </>
        )}

        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="m@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {!isSignup && (
              <Link href="#" className="ml-auto text-xs underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            )}
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {isSignup && (
          <div className="grid gap-2">
            <Label htmlFor="picture">Profile Picture</Label>
            <Input id="picture" type="file" {...register("picture")} />
            {errors.picture && <p className="text-xs text-red-500">{errors.picture.message}</p>}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <MoonLoader size={12} /> :
            isSignup ? "Register" : "Login"
          }
        </Button>
      </div>

      <div className="text-center text-xs">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
