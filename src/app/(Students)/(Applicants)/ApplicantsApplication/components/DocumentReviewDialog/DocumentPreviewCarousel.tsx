"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
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
  validPageUrls,
  failedPages,
  currentPage,
  carouselApi,
  setCarouselApi,
  onPageFailed,
  onSwitchToData,
}: DocumentPreviewCarouselProps) {
  return (
    <div className="flex flex-col border-b border-border bg-neutral-900/5 p-3 sm:p-4 lg:col-span-5 lg:border-r lg:border-b-0">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-navy">
          Document Preview {validPageUrls.length > 1 && `(Page ${currentPage} of ${validPageUrls.length})`}
        </span>
        {validPageUrls.length > 1 && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-7! rounded-full bg-white!"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!carouselApi?.canScrollPrev()}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-7! rounded-full bg-white!"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!carouselApi?.canScrollNext()}
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        {validPageUrls.length === 0 ? (
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
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {candidatePageUrls.map((url, index) => {
                if (failedPages[index]) return null;
                return (
                  <CarouselItem key={`page-${url}`}>
                    <div className="flex max-h-[50vh] min-h-65 w-full items-center justify-center overflow-auto bg-neutral-100/50 p-2 sm:max-h-[62vh] sm:min-h-95">
                      {/* biome-ignore lint/performance/noImgElement: dynamically loaded external PDF page previews from Cloudinary */}
                      <img
                        src={url}
                        alt={`${doc.document_type} page ${index + 1}`}
                        className="max-h-[48vh] max-w-full rounded-md object-contain shadow-sm sm:max-h-[60vh]"
                        onError={() => onPageFailed(index)}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Thumbnail / Page selection tabs if multi-page */}
      {validPageUrls.length > 1 && (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          {validPageUrls.map((url, idx) => {
            const active = currentPage === idx + 1;
            return (
              <button
                key={`page-btn-${url}`}
                type="button"
                onClick={() => carouselApi?.scrollTo(idx)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-navy text-white shadow-xs"
                    : "border border-border bg-white text-muted-foreground hover:text-navy"
                }`}
              >
                Page {idx + 1}
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
