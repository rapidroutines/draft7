import {
    BookOpen,
    ChartColumn,
    Dumbbell,
    Home,
    NotepadText,
    PackagePlus,
    Settings,
    ShoppingBag,
    TreePine,
    UserCheck,
    UserPlus,
    Users,
} from "lucide-react";
  
export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/dashboard", // Changed from "/" to "/dashboard"
            },
        ],
    },
    {
        title: "Hot Features",
        links: [
            {
                label: "Chatbot",
                icon: ChartColumn,
                path: "/dashboard/chatbot", // Updated with /dashboard prefix
            },
            {
                label: "RepBot",
                icon: NotepadText,
                path: "/dashboard/repbot", // Updated with /dashboard prefix
            },
        ],
    },
    {
        title: "Fitness Features",
        links: [
            {
                label: "Library",
                icon: BookOpen,
                path: "/dashboard/library", // Updated with /dashboard prefix
            },
            {
                label: "Exercise Tracker",
                icon: Dumbbell,
                path: "/dashboard/exercise-tracker", // Updated with /dashboard prefix
            },
            {
                label: "Rapidtree",
                icon: TreePine,
                path: "/dashboard/rapidtree", // Updated with /dashboard prefix
            },
        ],
    },
];
