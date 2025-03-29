import {
  BookOpen,
  ChartColumn,
  Dumbbell,
  Home,
  NotepadText,
  TreePine,
  Brain,
  ClipboardList
} from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
    ],
  },
  {
    title: "Hot Features",
    links: [
      {
        label: "Chatbot",
        icon: ChartColumn,
        path: "/chatbot",
      },
      {
        label: "RepBot",
        icon: NotepadText,
        path: "/repbot",
      },
      {
        label: "AI Workout",
        icon: Brain,
        path: "/ai-workout",
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
      {
        label: "Saved Workouts",
        icon: ClipboardList,
        path: "/saved-workouts",
      },
    ],
  },
];