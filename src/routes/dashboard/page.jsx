import { Link } from "react-router-dom";
import { MessageSquare, Camera, ArrowRight } from "lucide-react";

const DashboardPage = () => {
    return (
        <div className="flex flex-col gap-y-6">
            {/* Simple Header */}
            <div className="rounded-xl bg-[#1e628c] p-4 text-white shadow-md">
                <h1 className="text-2xl font-bold text-center">RapidRoutines AI Assistants</h1>
            </div>

            {/* Two-column layout for ChatBot and RepBot */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ChatBot Column */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        {/* ChatBot Header */}
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e628c] text-white shadow-sm">
                                <MessageSquare size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-[#1e628c] dark:text-blue-400">ChatBot</h2>
                        </div>
                        
                        <p className="mb-4 text-slate-700 dark:text-slate-300">
                            Your personal AI fitness coach providing customized workout plans and nutritional guidance.
                        </p>
                        
                        {/* ChatBot Visual Demo */}
                        <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                            <div className="border-b border-slate-200 p-3 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">ChatBot Interface</span>
                                </div>
                            </div>
                            
                            <div className="p-4 h-64">
                                <div className="mb-4 flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-slate-200 p-3 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                                        Hello! I'm your AI fitness coach. How can I help with your workout today?
                                    </div>
                                </div>
                                
                                <div className="mb-4 flex justify-end">
                                    <div className="max-w-[80%] rounded-lg bg-[#1e628c] p-3 text-sm text-white">
                                        I want to build muscle but only have dumbbells at home.
                                    </div>
                                </div>
                                
                                <div className="mb-4 flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-slate-200 p-3 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                                        Great! Dumbbells are versatile for muscle building. How many days per week can you train?
                                    </div>
                                </div>
                                
                                <div className="mb-4 flex justify-end">
                                    <div className="max-w-[80%] rounded-lg bg-[#1e628c] p-3 text-sm text-white">
                                        I can train 4 days a week.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-200 p-3 dark:border-slate-700">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Ask about your fitness goals..." 
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" 
                                        disabled 
                                    />
                                    <button className="rounded-lg bg-[#1e628c] px-3 py-2 text-white">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <Link 
                            to="/chatbot" 
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#1e628c] py-3 text-sm font-medium text-white hover:bg-[#174e70] transition-colors"
                        >
                            Launch ChatBot
                            <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>

                {/* RepBot Column */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        {/* RepBot Header */}
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e628c] text-white shadow-sm">
                                <Camera size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-[#1e628c] dark:text-blue-400">RepBot</h2>
                        </div>
                        
                        <p className="mb-4 text-slate-700 dark:text-slate-300">
                            AI-powered form analysis that provides real-time feedback on your exercise technique.
                        </p>
                        
                        {/* RepBot Visual Demo */}
                        <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="bg-slate-800 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-xs text-slate-300">RepBot Analysis</span>
                                </div>
                            </div>
                            
                            <div className="flex h-64 flex-col items-center justify-center bg-slate-900 p-4 relative">
                                {/* Simulated camera feed with overlay */}
                                <div className="w-full h-full bg-slate-700 rounded overflow-hidden relative">
                                    {/* Form analysis skeleton indicators */}
                                    <svg className="w-full h-full" viewBox="0 0 400 300">
                                        {/* Stick figure outline */}
                                        <g stroke="#1e628c" strokeWidth="2" fill="none">
                                            {/* Head */}
                                            <circle cx="200" cy="70" r="20" />
                                            {/* Body */}
                                            <line x1="200" y1="90" x2="200" y2="180" />
                                            {/* Arms */}
                                            <line x1="200" y1="120" x2="160" y2="150" />
                                            <line x1="200" y1="120" x2="240" y2="150" />
                                            {/* Legs */}
                                            <line x1="200" y1="180" x2="170" y2="250" />
                                            <line x1="200" y1="180" x2="230" y2="250" />
                                        </g>
                                        {/* Joint markers */}
                                        <g fill="#3dd1ff">
                                            <circle cx="200" cy="70" r="4" />
                                            <circle cx="200" cy="120" r="4" />
                                            <circle cx="160" cy="150" r="4" />
                                            <circle cx="240" cy="150" r="4" />
                                            <circle cx="200" cy="180" r="4" />
                                            <circle cx="170" cy="250" r="4" />
                                            <circle cx="230" cy="250" r="4" />
                                        </g>
                                    </svg>
                                    
                                    {/* Analysis overlay */}
                                    <div className="absolute top-4 right-4 bg-[#1e628c]/80 p-2 rounded text-white text-xs">
                                        Form Score: 85%
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 p-2 rounded text-white text-xs">
                                        Reps: 12
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800 p-3 text-white">
                                <div className="text-sm">
                                    <div className="font-medium text-green-400">Good form!</div>
                                    <div className="text-xs text-slate-300">Watch your knee alignment on the next rep.</div>
                                </div>
                            </div>
                        </div>
                        
                        <Link 
                            to="/repbot" 
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#1e628c] py-3 text-sm font-medium text-white hover:bg-[#174e70] transition-colors"
                        >
                            Launch RepBot
                            <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;