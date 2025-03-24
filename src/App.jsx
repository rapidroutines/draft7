import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page"; // Import the new ChatbotPage component

function App() {
    const router = createBrowserRouter([
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
                    element: <h1 className="title">Library</h1>,
                },
                {
                    path: "exercise-tracker",
                    element: <h1 className="title">Exercise Tracker</h1>,
                },
                {
                    path: "rapidtree",
                    element: <h1 className="title">Rapidtree</h1>,
                },
                {
                    path: "chatbot",
                    element: <ChatbotPage />, // Add the chatbot page route
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