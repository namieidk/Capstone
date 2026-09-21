"use client";

import { ChevronLeft, ChevronRight, FileText, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { ScholarDocument } from "@/lib/api/documents";

interface DocumentPreviewCarouselProps {
  document: ScholarDocument;
  candidatePageUrls: string[];
  validPageUrls: string[];
  failedPages: Record<number, boolean>;
  currentPage: number;
  carouselApi: CarouselApi | undefined;
  setCarouselApi: (api: CarouselApi) => void;
  onPageFailed: (pageIndex: number) => void;
  onSwitchToData?: () => void;
}

export function DocumentPreviewCarousel({
  document: doc,
  candidatePageUrls,
  failedPages,
  currentPage,
  carouselApi,
  setCarouselApi,
  onPageFailed,
  onSwitchToData,
}: DocumentPreviewCarouselProps) {
  const [zoom, setZoom] = useState(1);

  const validCandidates = useMemo(() => {
    return candidatePageUrls.map((url, index) => ({ url, index })).filter(({ index }) => !failedPages[index]);
  }, [candidatePageUrls, failedPages]);

  const hasMultiplePages = validCandidates.length > 1;

  const handlePrev = () => {
    if (!carouselApi) return;
    if (carouselApi.canScrollPrev()) {
      carouselApi.scrollPrev();
    } else {
      carouselApi.scrollTo(validCandidates.length - 1);
    }
  };

  const handleNext = () => {
    if (!carouselApi) return;
    if (carouselApi.canScrollNext()) {
      carouselApi.scrollNext();
    } else {
      carouselApi.scrollTo(0);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="flex flex-col border-b border-border bg-neutral-900/5 p-3 sm:p-4 lg:col-span-5 lg:border-r lg:border-b-0">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-navy truncate">
          Document Preview {hasMultiplePages && `(Page ${currentPage} of ${validCandidates.length})`}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5 shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6! rounded-md p-0"
              onClick={handleZoomOut}
              disabled={zoom <= 0.75}
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-3.5 text-navy" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6! px-1 text-[0.65rem]! font-semibold text-navy hover:bg-muted"
              onClick={handleZoomReset}
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6! rounded-md p-0"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-3.5 text-navy" />
            </Button>
          </div>

          {hasMultiplePages && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-7! rounded-full bg-white!"
                onClick={handlePrev}
                disabled={!hasMultiplePages}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-7! rounded-full bg-white!"
                onClick={handleNext}
                disabled={!hasMultiplePages}
                aria-label="Next page"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        {validCandidates.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
            <FileText className="size-10 text-muted-foreground/50" />
            <p className="text-xs">Preview image unavailable.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs!"
              onClick={() => window.open(doc.file_url, "_blank")}
            >
              Open PDF externally
            </Button>
          </div>
        ) : (
          <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {validCandidates.map(({ url, index }) => {
                return (
                  <CarouselItem key={`page-${url}`}>
                    <div className="flex max-h-[50vh] min-h-65 w-full items-center justify-center overflow-auto bg-neutral-100/50 p-2 sm:max-h-[62vh] sm:min-h-95">
                      <div
                        style={{
                          transform: `scale(${zoom})`,
                          transformOrigin: "center center",
                          transition: "transform 0.15s ease-out",
                        }}
                        className="flex items-center justify-center max-w-full max-h-full"
                      >
                        <Image
                          src={url}
                          alt={`${doc.document_type} page ${index + 1}`}
                          width={800}
                          height={1100}
                          unoptimized
                          className="max-h-[48vh] max-w-full rounded-md object-contain shadow-sm sm:max-h-[60vh]"
                          onError={() => onPageFailed(index)}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Thumbnail / Page selection tabs if multi-page */}
      {hasMultiplePages && (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          {validCandidates.map(({ url, index }, slideIdx) => {
            const active = currentPage === slideIdx + 1;
            return (
              <button
                key={`page-btn-${url}`}
                type="button"
                onClick={() => carouselApi?.scrollTo(slideIdx)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-navy text-white shadow-xs"
                    : "border border-border bg-white text-muted-foreground hover:text-navy"
                }`}
              >
                Page {index + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile-only CTA to quickly jump to data form */}
      {onSwitchToData && (
        <div className="mt-3 lg:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={onSwitchToData}
            className="h-9 w-full justify-between text-xs! font-semibold text-navy shadow-xs"
          >
            <span>Review Extracted Grades</span>
            <span>→</span>
          </Button>
        </div>
      )}
    </div>
  );
}
