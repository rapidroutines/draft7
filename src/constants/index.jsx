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
          path: "/", // This will work with HashRouter
        },
      ],
    },
    {
      title: "Hot Features",
      links: [
        {
          label: "Chatbot",
          icon: ChartColumn,
          path: "/chatbot", // React Router will handle this correctly with HashRouter
        },
        {
          label: "RepBot",
          icon: NotepadText,
          path: "/repbot", // React Router will handle this correctly with HashRouter
        },
      ],
    },
    {
      title: "Fitness Features",
      links: [
        {
          label: "Library",
          icon: BookOpen,
          path: "/library",
        },
        {
          label: "Exercise Tracker",
          icon: Dumbbell,
          path: "/exercise-tracker",
        },
        {
          label: "Rapidtree",
          icon: TreePine,
          path: "/rapidtree",
        },
      ],
    },
  ];
  
