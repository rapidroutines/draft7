// src/App.jsx - Updated version
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import LibraryPage from "@/routes/library/page";

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
                    element: <LibraryPage />,
                },
                {
                    path: "workout-plans",
                    element: <h1 className="title">Workout Plans</h1>,
                },
                {
                    path: "tutorials",
                    element: <h1 className="title">Video Tutorials</h1>,
                },
                {
                    path: "progress",
                    element: <h1 className="title">Progress Tracker</h1>,
                },
                {
                    path: "products",
                    element: <h1 className="title">Products</h1>,
                },
                {
                    path: "new-product",
                    element: <h1 className="title">New Product</h1>,
                },
                {
                    path: "inventory",
                    element: <h1 className="title">Inventory</h1>,
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
