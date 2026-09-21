"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/src/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Zod schema matching requested API keys
const noteSchema = z.object({
  addition_date: z.string().min(1, "تاريخ الإضافة مطلوب"),
  note: z.string().min(1, "الملاحظة مطلوبة"),
});

export default function AddNoteForm({ employee, onSuccess }) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      addition_date: new Date().toISOString().split('T')[0],
      note: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return axiosInstance.post(`/admin/employees/${employee?.id}/note`, payload);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "تم إضافة الملاحظة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["employee", String(employee?.id)] });
      queryClient.invalidateQueries({ queryKey: ["allEmployees"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء إضافة الملاحظة");
    }
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div dir='rtl' className="space-y-4 text-right">
          {/* Addition Date */}
          <FormField
            control={form.control}
            name="addition_date"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>التاريخ</FormLabel>
                <FormControl>
                  <Input type="date" className="h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note Textarea */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>الملاحظة</FormLabel>
                <FormControl>
                  <Textarea className="h-40" placeholder="أكتب ملاحظتك عن الموظف هنا..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button size="lg" type="submit" disabled={isPending} className="block w-fit mx-auto bg-brand-hover text-white px-8">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin size-4" />
              <span>جاري الحفظ...</span>
            </div>
          ) : (
            "حفظ الملاحظة"
          )}
        </Button>
      </form>
    </Form>
  );
}