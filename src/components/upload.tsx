"use client";

import { UploadAction } from "@/actions/upload";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Upload() {
  const [state, action, isPending] = React.useActionState(UploadAction, {
    output: {
      success: false,
      error: "",
    },
  });

  return (
    <form action={action} className="flex items-center gap-3">
      <label htmlFor="file" className="sr-only">
        File
      </label>
      <Input
        id="file"
        type="file"
        name="file"
        disabled={isPending}
        className="w-auto"
      />
      <Button type="submit" disabled={isPending}>
        Upload
      </Button>
    </form>
  );
}
