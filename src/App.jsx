import { createHashRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";

function App() {
    // Changed from createBrowserRouter to createHashRouter
    const router = createHashRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "analytics",
                    element: <h1 className="title">Analytics</h1>,
                },
                {
                    path: "reports",
                    element: <h1 className="title">Reports</h1>,
                },
                {
                    path: "library",
                    element: <LibraryPage />,
                },
                {
                    path: "exercise-tracker",
                    element: <ExerciseTrackerPage />,
                },
                {
                    path: "rapidtree",
                    element: <h1 className="title">Rapidtree</h1>,
                },
                {
                    path: "chatbot",
                    element: <ChatbotPage />,
                },
                {
                    path: "repbot",
                    element: <RepBotPage />,
                },
                {
                    path: "settings",
                    element: <h1 className="title">Settings</h1>,
                },
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