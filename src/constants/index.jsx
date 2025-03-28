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
                path: "/dashboard", // This is correct
            },
        ],
    },
    {
        title: "Hot Features",
        links: [
            {
                label: "Chatbot",
                icon: ChartColumn,
                path: "/dashboard/chatbot", // This is already correct
            },
            {
                label: "RepBot",
                icon: NotepadText,
                path: "/dashboard/repbot", // This is already correct
            },
        ],
    },
    {
        title: "Fitness Features",
        links: [
            {
                label: "Library",
                icon: BookOpen,
                path: "/dashboard/library", // This is already correct
            },
            {
                label: "Exercise Tracker",
                icon: Dumbbell,
                path: "/dashboard/exercise-tracker", // This is already correct
            },
            {
                label: "Rapidtree",
                icon: TreePine,
                path: "/dashboard/rapidtree", // This is already correct
            },
        ],
    },
];
