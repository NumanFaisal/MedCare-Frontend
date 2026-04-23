import { useState } from "react";
import { Star, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isSubmitting: boolean;
  doctorName: string;
}

// Star rating interactive component
function InteractiveStars({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          className="transition-transform hover:scale-125"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate(i)}
        >
          <Star
            className="w-7 h-7 transition-colors"
            fill={(hover || rating) >= i ? "#FBBF24" : "transparent"}
            stroke={(hover || rating) >= i ? "#FBBF24" : "#D1D5DB"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewModal({ isOpen, onClose, onSubmit, isSubmitting, doctorName }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    console.log("ReviewModal: Submitting with", { rating, comment });
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Rate Your Experience</h2>
            <p className="text-sm text-gray-500">{doctorName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">How was your experience?</p>
            <div className="flex justify-center">
              <InteractiveStars rating={rating} onRate={setRating} />
            </div>
            {rating > 0 && (
              <p className="text-xs text-gray-500 mt-2 animate-in fade-in">
                {["", "Poor", "Could be better", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Textarea
              placeholder="Share your experience... (optional)"
              className="min-h-[100px] resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <div className="text-right">
              <span className="text-[10px] text-gray-400">{comment.length}/500</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 text-white"
            disabled={rating === 0 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Submit Review
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
