"use server";

export type UploadActionState = {
  output:
    | {
        success: true;
        data: {
          battleId: string;
        };
      }
    | {
        success: false;
        error?: string;
      };
};

export async function UploadAction(
  _prevState: UploadActionState,
  formData: FormData,
): Promise<UploadActionState> {
  try {
    const file = formData.get("file");

    if (!file) {
      return {
        output: {
          success: false,
          error: "No file provided",
        },
      };
    }

    const form = new FormData();

    form.append("referenceID", "receipt-parser");
    form.append("file", file);

    const response = await fetch(
      "https://api.bem.ai/v2/functions/receipt-parser/call",
      {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.BEM_API_KEY ?? "",
        },
        body: form,
      },
    );

    if (!response.ok) {
      return {
        output: {
          success: false,
          error: await response.text(),
        },
      };
    }

    const data = await response.json();

    return {
      output: {
        success: true,
        data,
      },
    };
  } catch (error) {
    return {
      output: {
        success: false,
        error: String(error),
      },
    };
  }
}
