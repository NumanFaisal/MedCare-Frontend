import { useState } from "react";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar, Clock, MapPin, Star, AlertCircle, X,
  CheckCircle2, XCircle, Clock4, ChevronRight, MessageSquare, IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { NavLink } from "react-router-dom";

// --- TYPES ---
interface AppointmentData {
  id: number;
  appointmentDate: string;
  status: string;
  notes: string | null;
  hasReviewed: boolean;
  doctor: {
    id: number;
    specialization: string;
    hospitalAffiliation: string | null;
    consultationFee: number;
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string | null;
      userUniqueId: string;
    };
  };
  patient: {
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string | null;
      userUniqueId: string;
    };
    dateOfBirth: string | null;
    bloodType: string | null;
  };
}

// --- API ---
const fetchMyAppointments = async (): Promise<AppointmentData[]> => {
  const { data } = await api.get("/api/appointments/my-appointments");
  return data;
};

const cancelAppointment = async (id: number) => {
  const { data } = await api.patch(`/api/appointments/${id}/cancel`);
  return data;
};

const submitReview = async (payload: { targetType: string; targetId: number; rating: number; comment: string }) => {
  const { data } = await api.post("/api/reviews/add", payload);
  return data;
};

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

// Status badge
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    booked: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock4 },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle2 },
    completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock4 },
  };
  const c = config[status.toLowerCase()] || config.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [reviewTarget, setReviewTarget] = useState<{ appointmentId: number; doctorId: number; doctorName: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: fetchMyAppointments,
    staleTime: 1000 * 60 * 2,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success("Appointment cancelled.");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: () => toast.error("Failed to cancel appointment."),
  });

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success("Review submitted! Thank you for your feedback.");
      setReviewTarget(null);
      setReviewRating(0);
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: () => toast.error("Failed to submit review."),
  });

  const now = new Date();
  const upcoming = appointments.filter(a =>
    ["BOOKED", "CONFIRMED", "PENDING"].includes(a.status) && new Date(a.appointmentDate) >= now
  );
  const past = appointments.filter(a =>
    a.status === "COMPLETED" || a.status === "CANCELLED" || new Date(a.appointmentDate) < now
  );

  const displayedAppointments = activeTab === "upcoming" ? upcoming : past;

  const handleSubmitReview = () => {
    if (!reviewTarget || reviewRating === 0) {
      toast.warning("Please select a star rating.");
      return;
    }
    reviewMutation.mutate({
      targetType: "DOCTOR",
      targetId: reviewTarget.doctorId,
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-60 bg-slate-200" />
        <div className="grid gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-40 bg-slate-200 rounded-xl" />)}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-semibold">Failed to load appointments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Manage and review your appointments</p>
        </div>
        <Button asChild className="text-white">
          <NavLink to="/user/appointments/book-new">
            Book New Appointment
            <ChevronRight className="w-4 h-4 ml-1" />
          </NavLink>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "upcoming"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "past"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      {/* Appointments List */}
      {displayedAppointments.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-500">No {activeTab} appointments</h3>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === "upcoming"
              ? "Book an appointment to get started"
              : "Your past appointments will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayedAppointments.map((apt) => {
            const doctorName = `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`;
            const aptDate = new Date(apt.appointmentDate);
            const isUpcoming = ["BOOKED", "CONFIRMED", "PENDING"].includes(apt.status);
            const isCompleted = apt.status === "COMPLETED";

            return (
              <Card key={apt.id} className="border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {/* Left: Doctor Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {apt.doctor.user.firstName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{doctorName}</h3>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-sm text-primary font-medium mt-0.5">{apt.doctor.specialization}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {aptDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {apt.doctor.hospitalAffiliation && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {apt.doctor.hospitalAffiliation}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            ₹{apt.doctor.consultationFee}
                          </span>
                        </div>
                        {apt.notes && (
                          <p className="text-xs text-gray-400 mt-2 italic">Reason: {apt.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-2 shrink-0">
                      {isUpcoming && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                          onClick={() => cancelMutation.mutate(apt.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                      {isCompleted && !apt.hasReviewed && (
                        <Button
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs"
                          onClick={() => setReviewTarget({
                            appointmentId: apt.id,
                            doctorId: apt.doctor.id,
                            doctorName
                          })}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Write Review
                        </Button>
                      )}
                      {isCompleted && apt.hasReviewed && (
                        <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* --- REVIEW MODAL --- */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setReviewTarget(null)}>
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Rate Your Experience</h2>
                <p className="text-sm text-gray-500">{reviewTarget.doctorName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setReviewTarget(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">How was your experience?</p>
                <div className="flex justify-center">
                  <InteractiveStars rating={reviewRating} onRate={setReviewRating} />
                </div>
                {reviewRating > 0 && (
                  <p className="text-xs text-gray-500 mt-2 animate-in fade-in">
                    {["", "Poor", "Could be better", "Good", "Very Good", "Excellent"][reviewRating]}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <Textarea
                  placeholder="Share your experience... (optional)"
                  className="min-h-[100px] resize-none"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  maxLength={500}
                />
                <div className="text-right">
                  <span className="text-[10px] text-gray-400">{reviewComment.length}/500</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setReviewTarget(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 text-white"
                disabled={reviewRating === 0 || reviewMutation.isPending}
                onClick={handleSubmitReview}
              >
                {reviewMutation.isPending ? (
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
      )}
    </div>
  );
}
