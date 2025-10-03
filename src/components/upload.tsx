"use client";

import { UploadAction } from "@/actions/upload";
import * as React from "react";

export function Upload() {
  const [state, action, isPending] = React.useActionState(UploadAction, {
    output: {
      success: false,
      error: "",
    },
  });
  return (
    <form action={action} encType="multipart/form-data">
      <input id="file" type="file" name="file" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        Upload
      </button>
      <pre>{JSON.stringify(state.output, null, 2)}</pre>
    </form>
  );
}
