import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";

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
                    path: "chatbot",
                    element: <h1 className="title">Chatbot</h1>,
                },
                {
                    path: "repbot",
                    element: <h1 className="title">RepBot</h1>,
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