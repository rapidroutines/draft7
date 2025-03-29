import { useState } from "react";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";

// Create a context to manage routing
import { createContext } from "react";
export const RouteContext = createContext(null);

function App() {
    // State to manage the current route
    const [currentRoute, setCurrentRoute] = useState(window.location.pathname === "/" ? "/" : window.location.pathname);

    // Function to render the correct component based on route
    const renderContent = () => {
        switch (currentRoute) {
            case "/":
                return <DashboardPage />;
            case "/analytics":
                return <h1 className="title">Analytics</h1>;
            case "/reports":
                return <h1 className="title">Reports</h1>;
            case "/library":
                return <LibraryPage />;
            case "/exercise-tracker":
                return <ExerciseTrackerPage />;
            case "/rapidtree":
                return <RapidTreePage />;
            case "/chatbot":
                return <ChatbotPage />;
            case "/repbot":
                return <RepBotPage />;
            case "/settings":
                return <h1 className="title">Settings</h1>;
            default:
                return <DashboardPage />;
        }
    };

    // Custom navigation function
    const navigate = (path) => {
        // Update the URL without page refresh
        window.history.pushState({}, "", path);
        // Update the current route state
        setCurrentRoute(path);
    };

    return (
        <ThemeProvider storageKey="theme">
            <RouteContext.Provider value={{ currentRoute, navigate }}>
                <Layout>
                    {renderContent()}
                </Layout>
            </RouteContext.Provider>
        </ThemeProvider>
    );
}
