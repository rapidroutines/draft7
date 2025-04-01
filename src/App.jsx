import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";
import SavedChatsPage from "@/routes/saved-chats/page";

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/analytics" element={<h1 className="title"></h1>} />
                        <Route path="/reports" element={<h1 className="title"></h1>} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/exercise-tracker" element={<ExerciseTrackerPage />} />
                        <Route path="/rapidtree" element={<RapidTreePage />} />
                        <Route path="/chatbot" element={<ChatbotPage />} />
                        <Route path="/repbot" element={<RepBotPage />} />
                        <Route path="*" element={<DashboardPage />} />
                        <Route path="/saved-chats" element={<SavedChatsPage />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
}

export default App;