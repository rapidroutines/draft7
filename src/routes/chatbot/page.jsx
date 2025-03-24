import { MessageSquare, Maximize2, Minimize2, HelpCircle, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { Footer } from "@/layouts/footer";

const ChatbotPage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h1 className="title">Chatbot</h1>
                <div className="flex items-center gap-3">
                    <button 
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? (
                            <>
                                <Minimize2 size={18} />
                                <span className="hidden sm:inline">Exit Fullscreen</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 size={18} />
                                <span className="hidden sm:inline">Fullscreen</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Sidebar with info */}
                <div className={cn(
                    "col-span-1 flex flex-col gap-4",
                    isFullscreen && "hidden"
                )}>
                    <div className="card">
                        <div className="card-header">
                            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Info size={22} />
                            </div>
                            <p className="card-title">About Chatbot</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-slate-800 dark:text-slate-200">
                                This interactive chatbot assistant can help with a variety of tasks. Use it for information, assistance, or to manage your dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <HelpCircle size={22} />
                            </div>
                            <p className="card-title">Quick Tips</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <ul className="list-inside list-disc space-y-2 text-slate-800 dark:text-slate-200">
                                <li>Be specific with your questions</li>
                                <li>Try asking about dashboard features</li>
                                <li>Use simple, clear language</li>
                                <li>You can upload files when needed</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main chatbot container */}
                <div className={cn(
                    "col-span-1 md:col-span-3",
                    isFullscreen && "col-span-1 md:col-span-4 fixed inset-0 z-40 bg-white dark:bg-slate-900 p-4"
                )}>
                    <div className={cn(
                        "card flex flex-col",
                        isFullscreen ? "h-full" : "h-[600px]"
                    )}>
                        <div className="card-header border-b border-slate-200 dark:border-slate-700 pb-3">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <MessageSquare size={22} />
                            </div>
                            <p className="card-title">AI Assistant</p>
                            {isFullscreen && (
                                <button 
                                    className="ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                    onClick={toggleFullscreen}
                                >
                                    <Minimize2 size={18} />
                                </button>
                            )}
                        </div>
                        
                        <div className="relative flex-1 overflow-hidden bg-slate-50 dark:bg-slate-800">
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Loading chatbot...</p>
                                    </div>
                                </div>
                            )}
                            
                            <iframe 
                                src="https://old-chatbot.vercel.app" 
                                className="h-full w-full border-0"
                                onLoad={() => setIsLoading(false)}
                                title="Chatbot Interface"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {!isFullscreen && <Footer />}
        </div>
    );
};

export default ChatbotPage;