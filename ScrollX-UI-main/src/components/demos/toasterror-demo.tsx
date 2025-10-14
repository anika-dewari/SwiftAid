"use client";
import React from "react";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ToastError() {
  const { toast } = useToast();

  return (
    <Button
      variant="destructive"
      onClick={() =>
        toast.error("Error occurred!", {
          position: "top-right",
          description: "Something went wrong. Please try again.",
        })
      }
    >
      Error Toast
    </Button>
  );
}
