import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Navigate to="/dashboard" replace />, // Redirect root to dashboard
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "dashboard",
                    element: <DashboardPage />,
                },
                {
                    path: "dashboard/chatbot",
                    element: <ChatbotPage />,
                },
                {
                    path: "dashboard/repbot",
                    element: <RepBotPage />,
                },
                {
                    path: "dashboard/exercise-tracker",
                    element: <ExerciseTrackerPage />,
                },
                {
                    path: "dashboard/library",
                    element: <LibraryPage />,
                },
                {
                    path: "dashboard/rapidtree",
                    element: <RapidTreePage />,
                },
                {
                    path: "dashboard/analytics",
                    element: <h1 className="title">Analytics</h1>,
                },
                {
                    path: "dashboard/reports",
                    element: <h1 className="title">Reports</h1>,
                },
                {
                    path: "dashboard/settings",
                    element: <h1 className="title">Settings</h1>,
                },
                {
                    path: "*",
                    element: <Navigate to="/dashboard" replace />, // Handle unknown routes
                }
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
