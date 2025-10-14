"use client";
import React from "react";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ToastInfo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.info("Information", {
          position: "bottom-right",
          description: "Here's some helpful information for you.",
        })
      }
    >
      Info Toast
    </Button>
  );
}
