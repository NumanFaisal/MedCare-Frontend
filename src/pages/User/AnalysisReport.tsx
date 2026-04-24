import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Activity, FileText, Download, Clock, Info } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
import { format, addMonths } from "date-fns";

interface TimelineResponse {
  success: boolean;
  data: {
    report: string;
    searchSources: any;
    cached: boolean;
    generatedAt: string;
  };
}

export default function AnalysisReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const monthsParam = searchParams.get('months');
  const months = monthsParam ? parseInt(monthsParam, 10) : 6;

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: ['health-timeline', months],
    queryFn: async () => {
      const res = await api.get<TimelineResponse>(`/api/ai/timeline?months=${months}`);
      if (res.data.success && res.data.data) {
        return res.data.data;
      }
      throw new Error("Invalid response from server");
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const reportText = data?.report || "";
  const error = queryError ? (queryError as any).response?.data?.error || queryError.message : null;

  const generatedAt = data?.generatedAt ? new Date(data.generatedAt) : new Date();
  const nextAvailable = addMonths(generatedAt, 6);
  const isCached = data?.cached || false;

  const handleDownloadPdf = async () => {
    try {
      toast.info("Preparing PDF...");
      const res = await api.get(`/api/ai/timeline/pdf?months=${months}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Health-Timeline-${months}Months.pdf`);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download PDF report");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shadow-sm"
          onClick={() => navigate('/user')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-7 w-7 text-blue-600" />
            Health Analysis Report
          </h1>
          <p className="text-gray-500 mt-1">
            {months}-Month comprehensive review of your medical journey.
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          {reportText && !isLoading && (
            <Button 
              variant="outline" 
              className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
              onClick={handleDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Caching/Cooldown Info Strip */}
      {data && !isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50/50 border-blue-100 py-3 px-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="text-xs">
              <p className="text-blue-600 font-semibold uppercase tracking-wider">Report Status</p>
              <p className="text-blue-900 font-medium">{isCached ? "Cached Version" : "Newly Generated"}</p>
            </div>
          </Card>
          <Card className="bg-indigo-50/50 border-indigo-100 py-3 px-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-indigo-600" />
            <div className="text-xs">
              <p className="text-indigo-600 font-semibold uppercase tracking-wider">Generated On</p>
              <p className="text-indigo-900 font-medium">{format(generatedAt, 'PPP')}</p>
            </div>
          </Card>
          <Card className="bg-amber-50/50 border-amber-100 py-3 px-4 flex items-center gap-3">
            <Info className="h-5 w-5 text-amber-600" />
            <div className="text-xs">
              <p className="text-amber-600 font-semibold uppercase tracking-wider">Next Refresh Available</p>
              <p className="text-amber-900 font-medium">{format(nextAvailable, 'PPP')}</p>
            </div>
          </Card>
        </div>
      )}

      <Card className="border-blue-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            AI-Generated Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 min-h-[400px]">
          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              <div className="flex items-center justify-center py-10">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
                  <p className="text-blue-600 font-medium animate-pulse">Analyzing your medical records...</p>
                  <p className="text-sm text-gray-500 mt-1">This might take a few moments</p>
                </div>
              </div>
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-3 pt-6">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="bg-red-50 text-red-600 p-6 rounded-lg inline-block border border-red-100">
                <p className="font-medium text-lg mb-2">Analysis Failed</p>
                <p>{error}</p>
                <Button 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-blue max-w-none 
              prose-headings:text-indigo-900 prose-headings:font-bold 
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg 
              prose-p:text-gray-700 prose-li:text-gray-700
              prose-a:text-blue-600 hover:prose-a:text-blue-500
              prose-strong:text-indigo-900 rounded-lg">
              <ReactMarkdown>{reportText}</ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
