import { useState } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/analytics" element={<h1 className="title">Analytics</h1>} />
                        <Route path="/reports" element={<h1 className="title">Reports</h1>} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/exercise-tracker" element={<ExerciseTrackerPage />} />
                        <Route path="/rapidtree" element={<RapidTreePage />} />
                        <Route path="/chatbot" element={<ChatbotPage />} />
                        <Route path="/repbot" element={<RepBotPage />} />
                        <Route path="/settings" element={<h1 className="title">Settings</h1>} />
                        <Route path="*" element={<DashboardPage />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
}

export default App;
