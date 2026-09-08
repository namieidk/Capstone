"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { signContract } from "@/lib/api/contracts";

interface SignContractFormProps {
  contractId: number;
  onDone: () => void;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function SignContractForm({ contractId, onDone }: SignContractFormProps) {
  const [mode, setMode] = useState<"pad" | "upload">("pad");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const padRef = useRef<SignatureCanvas>(null);

  async function handleSignPad() {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) {
      setError("Please draw your signature first.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signContract(contractId, { signature_base64: pad.toDataURL("image/png") });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign contract.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignUpload() {
    if (!file) {
      setError("Please choose a PDF or image of your signature.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("File exceeds the 10MB size limit.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signContract(contractId, { signature_file: file });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign contract.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "pad" ? "default" : "outline"}
          size="sm"
          className="h-9 flex-1 text-xs!"
          onClick={() => setMode("pad")}
        >
          Draw signature
        </Button>
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          className="h-9 flex-1 text-xs!"
          onClick={() => setMode("upload")}
        >
          Upload file
        </Button>
      </div>

      {mode === "pad" ? (
        <>
          <SignatureCanvas
            ref={padRef}
            penColor="#0a4f42"
            canvasProps={{ className: "h-44 w-full cursor-crosshair rounded-md border border-line bg-tint" }}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 text-xs!"
              disabled={submitting}
              onClick={() => padRef.current?.clear()}
            >
              Clear
            </Button>
            <Button type="button" className="h-10 flex-1 text-xs!" disabled={submitting} onClick={handleSignPad}>
              {submitting ? "Signing..." : "Sign contract"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="h-10! bg-white! text-xs!"
            aria-label="Signature file"
          />
          {file && <p className="truncate text-xs text-muted-foreground">{file.name}</p>}
          <Button type="button" className="h-10 text-xs!" disabled={submitting || !file} onClick={handleSignUpload}>
            {submitting ? "Signing..." : "Sign with file"}
          </Button>
        </>
      )}

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
