"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ScholarDocument } from "@/lib/api/documents";
import { generatePreviewPageUrls } from "../../ApplicantsApplication/components/DocumentReviewDialog/types";

interface DocumentViewerDialogProps {
  document: ScholarDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getMaxPan(z: number) {
  if (z <= 1) return { x: 0, y: 0 };
  const factor = z - 1;
  return {
    x: Math.round(factor * 360),
    y: Math.round(factor * 400),
  };
}

export function DocumentViewerDialog({ document: doc, open, onOpenChange }: DocumentViewerDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [validUrls, setValidUrls] = useState<string[]>([]);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const candidatePageUrls = useMemo(() => {
    if (!doc?.file_url) return [];
    return generatePreviewPageUrls(doc.file_url, doc.file_type);
  }, [doc]);

  // Pre-probe candidate page URLs in parallel
  useEffect(() => {
    if (!open || !doc?.file_url || candidatePageUrls.length === 0) {
      setValidUrls([]);
      return;
    }

    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActivePageIndex(0);

    if (candidatePageUrls.length <= 1) {
      setValidUrls(candidatePageUrls);
      return;
    }

    setValidUrls([candidatePageUrls[0]]);

    let isMounted = true;
    const probes = candidatePageUrls.map((url, index) => {
      if (index === 0) return Promise.resolve({ url, valid: true });
      return new Promise<{ url: string; valid: boolean }>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({ url, valid: true });
        img.onerror = () => resolve({ url, valid: false });
        img.src = url;
      });
    });

    Promise.all(probes).then((results) => {
      if (!isMounted) return;
      const verified = results.filter((r) => r.valid).map((r) => r.url);
      setValidUrls(verified.length > 0 ? verified : [candidatePageUrls[0]]);
    });

    return () => {
      isMounted = false;
    };
  }, [open, doc?.file_url, candidatePageUrls]);

  const hasMultiplePages = validUrls.length > 1;
  const currentUrl = validUrls[activePageIndex] ?? validUrls[0];

  if (!doc) return null;

  const title = doc.label || doc.document_type.replace(/_/g, " ");

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 0.75);
      if (next <= 1) {
        setPan({ x: 0, y: 0 });
      } else {
        const maxPan = getMaxPan(next);
        setPan((curr) => ({
          x: Math.max(-maxPan.x, Math.min(maxPan.x, curr.x)),
          y: Math.max(-maxPan.y, Math.min(maxPan.y, curr.y)),
        }));
      }
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePageChange = (index: number) => {
    setActivePageIndex(index);
    setPan({ x: 0, y: 0 });
  };

  const handlePrevPage = () => {
    if (validUrls.length <= 1) return;
    handlePageChange(activePageIndex > 0 ? activePageIndex - 1 : validUrls.length - 1);
  };

  const handleNextPage = () => {
    if (validUrls.length <= 1) return;
    handlePageChange(activePageIndex < validUrls.length - 1 ? activePageIndex + 1 : 0);
  };

  // Mouse drag handling for panning (only active when zoomed in > 1)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxPan = getMaxPan(zoom);

    setPan({
      x: Math.max(-maxPan.x, Math.min(maxPan.x, panStartRef.current.x + dx)),
      y: Math.max(-maxPan.y, Math.min(maxPan.y, panStartRef.current.y + dy)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handling for mobile (only active when zoomed in > 1)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    panStartRef.current = { ...pan };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    const maxPan = getMaxPan(zoom);

    setPan({
      x: Math.max(-maxPan.x, Math.min(maxPan.x, panStartRef.current.x + dx)),
      y: Math.max(-maxPan.y, Math.min(maxPan.y, panStartRef.current.y + dy)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const isTransformed = zoom !== 1 || pan.x !== 0 || pan.y !== 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl! sm:max-w-5xl! w-[94vw]! h-[90vh] max-h-[92vh] p-0 flex flex-col overflow-hidden bg-white gap-0 border-line shadow-2xl rounded-2xl">
        {/* Header Bar */}
        <DialogHeader className="px-5 sm:px-6 py-3.5 border-b border-line flex flex-row items-center justify-between gap-4 shrink-0 bg-white">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <DialogTitle className="text-base sm:text-lg font-bold text-navy truncate">{title}</DialogTitle>
              <Badge variant="outline" className="text-xs font-semibold shrink-0">
                {doc.status}
              </Badge>
            </div>
            <DialogDescription className="text-xs text-muted-foreground truncate mt-0.5">
              {doc.file_name || doc.document_type}
              {doc.uploaded_at
                ? ` · Uploaded ${new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`
                : ""}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pr-8">
            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 rounded-xl border border-line bg-tint/60 p-0.5 shadow-2xs">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7.5 rounded-lg p-0 text-navy hover:bg-white"
                onClick={handleZoomOut}
                disabled={zoom <= 0.75}
                title="Zoom out"
                aria-label="Zoom out"
              >
                <ZoomOut className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7.5 px-2 text-xs font-bold text-navy hover:bg-white min-w-12 text-center"
                onClick={handleResetView}
                title="Click to reset zoom and center"
                aria-label="Reset zoom"
              >
                {Math.round(zoom * 100)}%
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7.5 rounded-lg p-0 text-navy hover:bg-white"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom in"
                aria-label="Zoom in"
              >
                <ZoomIn className="size-4" />
              </Button>
              {isTransformed && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7.5 rounded-lg p-0 text-muted-foreground hover:text-navy hover:bg-white"
                  onClick={handleResetView}
                  title="Reset view (100% & center)"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              )}
            </div>

            {/* Direct Download */}
            {doc.file_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8.5 px-3 text-xs font-semibold gap-1.5 text-navy border-line hidden sm:flex hover:bg-tint"
                asChild
              >
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="size-3.5" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Interactive Pan & Zoom Viewport Canvas */}
        <section
          aria-label="Document view canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 w-full bg-[#181d24] overflow-hidden flex items-center justify-center select-none touch-none"
          style={{
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          {!currentUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center text-white/70">
              <FileText className="size-14 text-white/40" />
              <p className="text-base font-semibold text-white">Preview unavailable</p>
              <p className="text-xs text-white/60 max-w-sm">
                This document cannot be rendered inline. You can open or download the original file.
              </p>
              {doc.file_url && (
                <Button type="button" variant="secondary" size="sm" asChild className="mt-2">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                    <ExternalLink className="size-3.5" />
                    Open file in new tab
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <div
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.12s ease-out",
                pointerEvents: "none",
              }}
              className="flex items-center justify-center max-w-full max-h-full p-4"
            >
              <Image
                src={currentUrl}
                alt={`${title} Page ${activePageIndex + 1}`}
                width={1200}
                height={1600}
                unoptimized
                priority
                className="max-h-[66vh] max-w-[85vw] sm:max-w-2xl w-auto h-auto rounded-lg object-contain shadow-2xl bg-white border border-white/20"
              />
            </div>
          )}

          {/* Floating Navigation Controls */}
          {hasMultiplePages && (
            <div className="absolute inset-y-0 inset-x-4 sm:inset-x-8 flex items-center justify-between pointer-events-none">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 rounded-full bg-white text-navy shadow-xl pointer-events-auto hover:bg-white hover:scale-105 active:scale-95 transition-all border-line cursor-pointer"
                onClick={handlePrevPage}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 rounded-full bg-white text-navy shadow-xl pointer-events-auto hover:bg-white hover:scale-105 active:scale-95 transition-all border-line cursor-pointer"
                onClick={handleNextPage}
                aria-label="Next page"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          )}

          {/* Floating Move / Pan Hint (only displayed when zoomed in > 100%) */}
          {zoom > 1 && (
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white/80 text-[11px] pointer-events-none">
              <Move className="size-3" />
              <span>Click & drag to move</span>
            </div>
          )}
        </section>

        {/* Footer Page Indicator Tabs */}
        {hasMultiplePages && (
          <div className="px-6 py-2.5 border-t border-line bg-white flex items-center justify-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground mr-1.5 font-medium">
              Page {activePageIndex + 1} of {validUrls.length}:
            </span>
            {validUrls.map((url, slideIdx) => {
              const active = activePageIndex === slideIdx;
              return (
                <button
                  key={`page-btn-${url}`}
                  type="button"
                  onClick={() => handlePageChange(slideIdx)}
                  className={`rounded-lg px-3.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-navy text-white shadow-xs"
                      : "border border-line bg-tint/50 text-muted-foreground hover:text-navy hover:bg-white"
                  }`}
                >
                  Page {slideIdx + 1}
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
