"use client";
import React from "react";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ToastDefault() {
  const { toast } = useToast();

  return (
    <Button
      variant="default"
      onClick={() =>
        toast("Default Toast", {
          description: "This is a default toast message.",
        })
      }
    >
      Default Toast
    </Button>
  );
}
