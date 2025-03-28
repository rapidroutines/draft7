import { useLocation } from "react-router-dom";

const PathDisplay = () => {
    const location = useLocation();
    
    // Just display the current path
    const formatPath = (path) => {
        // Remove trailing slash if it exists
        return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    };
    
    return (
        <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-700 shadow-sm border border-slate-200 z-50">
            {formatPath(location.pathname)}
        </div>
    );
};

export default PathDisplay;
