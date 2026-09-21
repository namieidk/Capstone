"use client";

import { AlertCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationItem } from "@/lib/api/chat";

interface ChatRequestBannerProps {
  activeConvo: ConversationItem;
  isGrantorOrStaff: boolean;
  partnerName: string;
  respondingToRequest: boolean;
  onRespondRequest: (action: "ACCEPT" | "REJECT") => void;
}

export function ChatRequestBanner({
  activeConvo,
  isGrantorOrStaff,
  partnerName,
  respondingToRequest,
  onRespondRequest,
}: ChatRequestBannerProps) {
  // 1. Grantor/Staff Review Banner
  if (activeConvo.status === "PENDING_REQUEST" && isGrantorOrStaff) {
    return (
      <div className="border-b border-amber-200 bg-amber-50/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
            <AlertCircle className="size-4 text-amber-600 shrink-0" />
            <span>Message Access Request</span>
          </div>
          <p className="text-xs text-amber-800 mt-1">
            <span className="font-semibold">{partnerName}</span> has requested permission to message you:
          </p>
          {activeConvo.request_note && (
            <p className="text-xs italic bg-white/90 border border-amber-200 rounded-md p-2 mt-1.5 text-foreground/90 leading-relaxed">
              "{activeConvo.request_note}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={respondingToRequest}
            onClick={() => onRespondRequest("REJECT")}
            className="h-8 rounded-full border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold px-3"
          >
            Decline
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={respondingToRequest}
            onClick={() => onRespondRequest("ACCEPT")}
            className="h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 shadow-2xs"
          >
            Accept & Chat
          </Button>
        </div>
      </div>
    );
  }

  // 2. Scholar Pending Approval Notice
  if (activeConvo.status === "PENDING_REQUEST" && !isGrantorOrStaff) {
    return (
      <div className="border-b border-amber-200 bg-amber-50/90 p-3.5 flex items-center gap-2.5 text-xs text-amber-900">
        <Clock className="size-4 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold">Message Request Pending:</span> Your request to message {partnerName} is awaiting
          grantor approval. Once accepted, you can chat directly.
        </div>
      </div>
    );
  }

  // 3. Request Declined Notice
  if (activeConvo.status === "REJECTED") {
    return (
      <div className="border-b border-rose-200 bg-rose-50/90 p-3.5 flex items-center gap-2.5 text-xs text-rose-900">
        <XCircle className="size-4 text-rose-600 shrink-0" />
        <div>
          <span className="font-bold">Request Declined:</span> This message request was declined. Please consult your
          coordinator for further questions.
        </div>
      </div>
    );
  }

  return null;
}
