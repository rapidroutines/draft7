import { useLocation } from "react-router-dom";

const PathDisplay = () => {
    const location = useLocation();
    
    // Format the path to be more readable
    const formatPath = (path) => {
        if (path === "/") return "dashboard";
        
        // Remove the leading slash and replace with 'dashboard/'
        return "dashboard" + path;
    };
    
    return (
        <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-700 shadow-sm border border-slate-200 z-50">
            {formatPath(location.pathname)}
        </div>
    );
};

export default PathDisplay;
