'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { useFetch } from "@/lib/hooks/useFetch";
import { Check, CheckCircle2 } from "lucide-react";

const shareSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    message: z.string().min(1, "Message is required"),
    senderEmail: z.string().email(),
}).refine((data) => data.email !== data.senderEmail, {
    message: "Recipient email cannot be the same as your email",
    path: ["email"],
});

export function ShareTaskForm({ taskId, from,senderEmail }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(shareSchema),
        defaultValues: {
            senderEmail, // needed for validation, not shown in form
        },
    });
    
    const { loading, error, data, refetch } = useFetch("/api/tasks/share", {}, false, false);

    const onSubmit = async (formValues) => {
        const result = await refetch({
            method: 'POST',
            body: JSON.stringify({
                ...formValues,
                taskId,
                from,
            }),
        });

        if (result.success) {
            toast.success('Task shared successfully!');
            reset(); // clear the form
        } else {
            toast.error(result.message || 'Something went wrong');
        }
    };

    return (

        data ? <div className="flex min-w-[20vh] flex-col gap-1 items-center justify-center align-middle h-full">
            <img src={data?.recipient.image} alt="user's avatar" width={35} height={35} className="border-blue-700 hover:border-amber-500 p-[2px] rounded-full object-cover aspect-square" />
            <p>  {data.recipient.username}  <CheckCircle2 className="inline size-3.5" /></p>
            <p className="text-xs text-muted-foreground">
              Task Sent to {data.recipient.name.split(' ')[0]}
            </p>
        </div> : <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-1">
                <Label htmlFor="username">Recipient Username</Label>
                <Input id="username" placeholder="e.g. wrong.one_" {...register("username")} />
                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div className="grid gap-1">
                <Label htmlFor="email">Recipient Email</Label>
                <Input id="email" type="email" placeholder="e.g. user@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-1">
                <Label htmlFor="message">Message</Label>
                <Input id="message" placeholder="Hey, check this out!" {...register("message")} />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <MoonLoader size={12} /> : "Share Task"}
            </Button>
        </form>

    );
}
