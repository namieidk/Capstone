"use client";

import { AlertCircle, Check, ExternalLink, Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { ScholarDocument } from "@/lib/api/documents";
import { docStatusMeta, formatDateTime } from "../wizard-helpers";
import { DocumentPreviewCarousel } from "./DocumentPreviewCarousel";

export interface DocumentReviewDrawerProps {
  document: ScholarDocument;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidatePageUrls: string[];
  validPageUrls: string[];
  failedPages: Record<number, boolean>;
  currentPage: number;
  carouselApi: CarouselApi | undefined;
  setCarouselApi: (api: CarouselApi) => void;
  onPageFailed: (pageIndex: number) => void;
  isMismatch: boolean;
  isReadOnly: boolean;
  submitting: boolean;
  onSubmit: () => void;
  children: React.ReactNode;
}

export function DocumentReviewDrawer({
  document: doc,
  open,
  onOpenChange,
  candidatePageUrls,
  validPageUrls,
  failedPages,
  currentPage,
  carouselApi,
  setCarouselApi,
  onPageFailed,
  isMismatch,
  isReadOnly,
  submitting,
  onSubmit,
  children,
}: DocumentReviewDrawerProps) {
  const [mobileTab, setMobileTab] = useState<"preview" | "data">("preview");
  const meta = docStatusMeta(doc.status);

  // Reset tab to preview when drawer closes
  useEffect(() => {
    if (!open) {
      setMobileTab("preview");
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex h-[92dvh] max-h-[92dvh]! flex-col rounded-t-[24px] border-t border-border bg-white text-navy focus:outline-none p-0 overflow-hidden shadow-2xl">
        {/* Accessible hidden header for screen-readers & Vaul */}
        <DrawerHeader className="sr-only">
          <DrawerTitle>{doc.document_type || "Document Review"}</DrawerTitle>
          <DrawerDescription>Review document preview and confirmed academic details</DrawerDescription>
        </DrawerHeader>

        {/* Mobile Visual Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-3.5 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-navy shadow-2xs">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-bold text-navy">{doc.document_type}</span>
                <Badge variant={meta.variant} className="h-4.5 shrink-0 px-1.5 text-[0.62rem] font-semibold">
                  {meta.label}
                </Badge>
              </div>
              <p className="truncate text-[0.68rem] text-muted-foreground">
                {doc.file_name ?? "Document"} · {formatDateTime(doc.uploaded_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8 rounded-lg border-border text-navy hover:bg-slate-100"
              onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")}
              title="Open original file in new tab"
              aria-label="Open original file in new tab"
            >
              <ExternalLink className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Mobile Segmented Switcher */}
        <div className="shrink-0 border-b border-border bg-slate-50/90 px-3 py-2">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                mobileTab === "preview" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-navy"
              }`}
            >
              <Eye className="size-3.5" />
              <span>Document</span>
              {validPageUrls.length > 1 && (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[0.65rem] font-bold text-navy">
                  {currentPage}/{validPageUrls.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("data")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                mobileTab === "data" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-navy"
              }`}
            >
              <FileText className="size-3.5" />
              <span>Information</span>
              {isReadOnly && !isMismatch && <Check className="size-3 text-good stroke-3" />}
            </button>
          </div>
        </div>

        {/* Mobile Scrollable Area */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50">
          {mobileTab === "preview" ? (
            <div className="p-3">
              <DocumentPreviewCarousel
                document={doc}
                candidatePageUrls={candidatePageUrls}
                validPageUrls={validPageUrls}
                failedPages={failedPages}
                currentPage={currentPage}
                carouselApi={carouselApi}
                setCarouselApi={setCarouselApi}
                onPageFailed={onPageFailed}
                className="border-0 bg-white shadow-2xs rounded-xl p-3"
              />
            </div>
          ) : (
            <div className="p-3.5 space-y-3.5">{children}</div>
          )}
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="shrink-0 border-t border-border bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-lg">
          {isMismatch ? (
            <div className="mb-2 flex items-center justify-center gap-1.5 text-[0.72rem] font-medium text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>Invalid document type for your year level.</span>
            </div>
          ) : isReadOnly ? (
            <div className="mb-2 flex items-center justify-center gap-1.5 text-[0.72rem] text-muted-foreground">
              <Check className="size-3.5 shrink-0 text-good" />
              <span>Document confirmed and locked.</span>
            </div>
          ) : (
            <p className="mb-2 text-center text-[0.7rem] text-muted-foreground">
              Confirming submits this document for coordinator verification.
            </p>
          )}

          <div className={`grid gap-2 ${isReadOnly ? "grid-cols-1" : "grid-cols-2"}`}>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl text-xs font-semibold text-navy border-border hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              {isReadOnly ? "Close" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <Button
                type="button"
                className="h-10 rounded-xl bg-navy text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
                onClick={onSubmit}
                disabled={submitting || isMismatch}
              >
                <Check className="size-4 shrink-0" />
                <span className="truncate">{submitting ? "Saving..." : "Confirm & Submit"}</span>
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
