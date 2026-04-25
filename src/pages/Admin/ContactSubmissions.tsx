import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, User, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ContactSubmissions() {
    const { data: submissions, isLoading } = useQuery({
        queryKey: ['contact-submissions'],
        queryFn: async () => {
            const { data } = await api.get('/api/contact');
            return data;
        }
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 px-4">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Contact Form Submissions</h1>
            <div className="grid gap-6">
                {submissions?.length > 0 ? (
                    submissions.map((sub: any) => (
                        <Card key={sub.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        {sub.firstName} {sub.lastName}
                                    </CardTitle>

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        {format(new Date(sub.createdAt), 'PPP p')}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</h4>
                                    <p className="text-lg font-medium text-gray-900">{sub.subject}</p>
                                </div>
                                <div className="space-y-3">

                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Mail className="h-4 w-4" />
                                        <a href={`mailto:${sub.email}`} className="hover:underline">{sub.email}</a>
                                    </div>
                                    <div className="flex gap-2">
                                        <MessageSquare className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                                        <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg w-full border border-gray-100">
                                            {sub.message}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No submissions yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
