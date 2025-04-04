import { useState } from "react";
import { Footer } from "@/layouts/footer";

const ChatbotPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="flex flex-col gap-y-6">
            {/* Simple Title */}
            <h1 className="title">AI Fitness Assistant</h1>

            {/* Clean White Container with Dark Border */}
            <div className="w-full h-[700px] rounded-xl overflow-hidden bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 shadow-md">
                {/* Loading Indicator */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
                    </div>
                )}
                
                {/* Chatbot Iframe with Improved UI */}
                <div className="h-full w-full p-0">
                    <iframe 
                        src="https://render-chatbot-2.onrender.com" 
                        className="h-full w-full border-0"
                        onLoad={() => setIsLoading(false)}
                        title="Chatbot Interface"
                        style={{ borderRadius: '0.5rem' }}
                    ></iframe>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ChatbotPage;
