import React, { useState } from 'react';
import { Bug, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BugReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Logic for submitting bug report (e.g., to an API or email)
      console.log('Bug Report Submitted:', description);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Bug report submitted. Thank you for helping us improve!');
      setDescription('');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-all hover:scale-110 z-50 group"
        title="Report a Bug"
      >
        <Bug className="w-6 h-6" />
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Report a Bug
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Report a Bug</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-gray-600 mb-4 text-sm">
                Found something broken? Please describe the issue and we'll look into it. 
                Include steps to reproduce if possible.
              </p>
              
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                placeholder="Describe the bug here..."
              ></textarea>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !description.trim()}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BugReportModal;
