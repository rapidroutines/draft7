import { useState, useEffect } from "react";
import { MessageSquare, Clock, Search, Plus, X, Info } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";

const SavedChatsPage = () => {
    const [savedChats, setSavedChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [isEmpty, setIsEmpty] = useState(true);
    
    // Load saved chats from localStorage
    useEffect(() => {
        const chats = localStorage.getItem("savedChats");
        if (chats) {
            try {
                const parsedChats = JSON.parse(chats);
                setSavedChats(parsedChats);
                setIsEmpty(parsedChats.length === 0);
            } catch (error) {
                console.error("Error parsing saved chats:", error);
                setIsEmpty(true);
            }
        }
    }, []);
    
    // Filter chats based on search query
    const filteredChats = searchQuery.trim() === "" 
        ? savedChats 
        : savedChats.filter(chat => 
            chat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            chat.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
    // Delete a saved chat
    const deleteChat = (id) => {
        if (window.confirm("Are you sure you want to delete this chat?")) {
            const updatedChats = savedChats.filter(chat => chat.id !== id);
            setSavedChats(updatedChats);
            localStorage.setItem("savedChats", JSON.stringify(updatedChats));
            
            if (selectedChat && selectedChat.id === id) {
                setSelectedChat(null);
            }
            
            setIsEmpty(updatedChats.length === 0);
        }
    };
    
    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <div className="flex flex-col gap-y-6">
            {/* Header with title and description */}
            <div className="flex items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c] text-white">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h1 className="title">Saved Chats</h1>
                        <p className="text-slate-600 text-sm">View and manage your saved conversations from the chatbot</p>
                    </div>
                </div>
            </div>
            
            {isEmpty ? (
                // Empty state
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <MessageSquare size={24} className="text-slate-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">No saved chats yet</h2>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Save useful conversations from the chatbot by clicking the "Save" button when chatting with the AI assistant.
                    </p>
                    <a 
                        href="/chatbot"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1e628c] text-white hover:bg-[#174e70]"
                    >
                        <Plus size={16} />
                        Go to Chatbot
                    </a>
                </div>
            ) : (
                // Grid layout for chats
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left sidebar: Chat list */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Search bar */}
                            <div className="p-4 border-b border-slate-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search saved chats..."
                                        className="w-full py-2 pl-10 pr-4 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:border-transparent"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* Chat list */}
                            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                                {filteredChats.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500">
                                        No chats matching your search
                                    </div>
                                ) : (
                                    filteredChats.map((chat) => (
                                        <div 
                                            key={chat.id}
                                            className={cn(
                                                "p-4 cursor-pointer hover:bg-slate-50",
                                                selectedChat?.id === chat.id && "bg-slate-50"
                                            )}
                                            onClick={() => setSelectedChat(chat)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-slate-900 line-clamp-1">{chat.title}</h3>
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                                        <Clock size={12} />
                                                        <span>{formatDate(chat.date)}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="p-1 text-slate-400 hover:text-red-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteChat(chat.id);
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                                                {chat.content}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Right panel: Chat content */}
                    <div className="lg:col-span-2">
                        {selectedChat ? (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="border-b border-slate-200 bg-slate-50 p-4">
                                    <h2 className="text-xl font-semibold text-slate-900">{selectedChat.title}</h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Saved on {formatDate(selectedChat.date)}
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="prose max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: selectedChat.content }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center h-full">
                                <div className="bg-slate-100 rounded-full p-4 mb-4">
                                    <MessageSquare className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">Select a Chat</h3>
                                <p className="text-slate-500 text-center">
                                    Choose a saved chat from the list to view its content
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default SavedChatsPage;