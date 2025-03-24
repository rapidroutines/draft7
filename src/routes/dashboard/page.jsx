import { useState } from "react";
import { Area, AreaChart, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import { 
    Activity, 
    Brain, 
    MessageSquare, 
    Zap,
    Dumbbell,
    BarChart4,
    Sparkles,
    BookOpen,
    PieChart as PieChartIcon,
    Lightbulb,
    Camera,
    PenTool,
    Award,
    PlayCircle,
    User,
    Eye,
    ArrowRight,
    ChevronRight,
    ScrollText,
    BarChart2,
    Clipboard,
    LineChart as LineChartIcon
} from "lucide-react";

const DashboardPage = () => {
    const { theme } = useTheme();
    const [activeDemo, setActiveDemo] = useState('chat');
    
    // Sample data for demo visualizations
    const workoutAnalysisData = [
        { name: 'Form', correct: 75, incorrect: 25 },
        { name: 'Depth', correct: 60, incorrect: 40 },
        { name: 'Tempo', correct: 85, incorrect: 15 },
        { name: 'Alignment', correct: 65, incorrect: 35 },
        { name: 'Range', correct: 80, incorrect: 20 }
    ];
    
    // Chat conversation flow data
    const conversationFlowData = [
        { step: 1, query: 65, response: 80, followup: 45 },
        { step: 2, query: 50, response: 75, followup: 60 },
        { step: 3, query: 75, response: 90, followup: 40 },
        { step: 4, query: 60, response: 85, followup: 55 },
        { step: 5, query: 80, response: 95, followup: 50 }
    ];
    
    // Nutrition recommendation categories
    const nutritionCategories = [
        { name: 'Protein', value: 35 },
        { name: 'Carbs', value: 30 },
        { name: 'Fats', value: 20 },
        { name: 'Vegetables', value: 15 }
    ];
    
    const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'];
    
    // Sample workout plans
    const workoutPlans = [
        { id: 1, name: "Strength Building", level: "Intermediate", duration: "8 weeks", exercises: 24 },
        { id: 2, name: "HIIT Cardio", level: "Advanced", duration: "4 weeks", exercises: 18 },
        { id: 3, name: "Yoga Flexibility", level: "Beginner", duration: "6 weeks", exercises: 16 }
    ];
    
    // Form analysis examples
    const formAnalysisExamples = [
        { id: 1, exercise: "Squat", issues: ["Knees caving in", "Limited depth"], tips: ["Keep knees aligned with toes", "Focus on hip mobility"] },
        { id: 2, exercise: "Deadlift", issues: ["Rounded back", "Improper bar path"], tips: ["Maintain neutral spine", "Keep bar close to body"] },
        { id: 3, exercise: "Bench Press", issues: ["Uneven press", "Elbow flare"], tips: ["Balance the bar", "Tuck elbows at 45°"] }
    ];
    
    // Chat features
    const chatFeatures = [
        { 
            title: "Personalized Workout Plans", 
            icon: <Clipboard size={22} />, 
            description: "AI-generated workout routines based on goals, equipment, and fitness level" 
        },
        { 
            title: "Nutrition Guidance", 
            icon: <PieChartIcon size={22} />, 
            description: "Meal planning and nutritional advice customized to your dietary needs" 
        },
        { 
            title: "Progress Tracking", 
            icon: <LineChartIcon size={22} />, 
            description: "Visualize fitness improvements and adapt your training accordingly" 
        },
        { 
            title: "24/7 Motivation", 
            icon: <Lightbulb size={22} />, 
            description: "Receive encouraging messages and tips to keep you consistent" 
        }
    ];
    
    // RepBot features
    const repbotFeatures = [
        { 
            title: "Real-time Form Analysis", 
            icon: <Camera size={22} />, 
            description: "Analyzes your movement patterns during exercises to ensure safe execution" 
        },
        { 
            title: "Detailed Feedback", 
            icon: <PenTool size={22} />, 
            description: "Provides specific pointers on how to correct your technique" 
        },
        { 
            title: "Progress Reports", 
            icon: <BarChart2 size={22} />, 
            description: "Tracks improvements in form quality over time across exercises" 
        },
        { 
            title: "Achievement System", 
            icon: <Award size={22} />, 
            description: "Earn badges and recognition as your form and consistency improve" 
        }
    ];
    
    // Sample chat conversation
    const sampleConversation = [
        { role: "user", message: "I want to build muscle but only have dumbbells at home" },
        { role: "assistant", message: "I can help with that! Dumbbells are versatile for muscle building. How many days per week can you train?" },
        { role: "user", message: "I can train 4 days a week" },
        { role: "assistant", message: "Great! I recommend an upper/lower split routine. Would you like me to create a specific plan for you?" },
        { role: "user", message: "Yes please" }
    ];

    return (
        <div className="flex flex-col gap-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold md:text-4xl">AI Fitness Assistants</h1>
                        <p className="mt-2 max-w-xl text-blue-100">Smart conversational agents and form analysis tools that revolutionize your fitness journey</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <a href="/chatbot" className="flex items-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-lg transition-all hover:bg-white/20">
                            <MessageSquare size={18} className="mr-2" />
                            Try ChatBot
                        </a>
                        <a href="/repbot" className="flex items-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-lg transition-all hover:bg-white/20">
                            <Camera size={18} className="mr-2" />
                            Try RepBot
                        </a>
                    </div>
                </div>
            </div>

            {/* Feature Showcase Boxes */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ChatBot Box */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-md transition-all hover:shadow-lg dark:from-blue-950 dark:to-blue-900">
                    <div className="absolute bottom-0 right-0 h-48 w-48 translate-x-8 translate-y-8 rounded-full bg-blue-400/10 dark:bg-blue-500/10"></div>
                    
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white dark:bg-blue-600">
                            <MessageSquare size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">ChatBot</h2>
                    </div>
                    
                    <p className="mb-6 text-slate-700 dark:text-slate-300">
                        Your personal AI fitness coach. Get customized workout plans, nutritional advice, and motivation - all through natural conversation.
                    </p>
                    
                    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {chatFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2 rounded-lg bg-white/50 p-3 backdrop-blur-sm dark:bg-slate-800/50">
                                <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-auto flex justify-between">
                        <button 
                            onClick={() => setActiveDemo('chat')} 
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            View Demo
                        </button>
                        <a 
                            href="/chatbot" 
                            className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400"
                        >
                            Launch ChatBot
                            <ArrowRight size={16} className="ml-1" />
                        </a>
                    </div>
                </div>

                {/* RepBot Box */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-md transition-all hover:shadow-lg dark:from-green-950 dark:to-green-900">
                    <div className="absolute bottom-0 right-0 h-48 w-48 translate-x-8 translate-y-8 rounded-full bg-green-400/10 dark:bg-green-500/10"></div>
                    
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white dark:bg-green-600">
                            <Camera size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-green-700 dark:text-green-400">RepBot</h2>
                    </div>
                    
                    <p className="mb-6 text-slate-700 dark:text-slate-300">
                        AI-powered exercise form analysis. Get real-time feedback on your technique to maximize results and prevent injuries.
                    </p>
                    
                    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {repbotFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2 rounded-lg bg-white/50 p-3 backdrop-blur-sm dark:bg-slate-800/50">
                                <div className="mt-0.5 text-green-600 dark:text-green-400">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-auto flex justify-between">
                        <button 
                            onClick={() => setActiveDemo('repbot')} 
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                            View Demo
                        </button>
                        <a 
                            href="/repbot" 
                            className="flex items-center text-sm font-medium text-green-600 dark:text-green-400"
                        >
                            Launch RepBot
                            <ArrowRight size={16} className="ml-1" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
                <div className="mb-6 flex flex-wrap items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interactive Feature Demo</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveDemo('chat')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                                activeDemo === 'chat' 
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            <MessageSquare size={16} />
                            ChatBot
                        </button>
                        <button 
                            onClick={() => setActiveDemo('repbot')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                                activeDemo === 'repbot' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Camera size={16} />
                            RepBot
                        </button>
                    </div>
                </div>

                {/* ChatBot Demo Content */}
                {activeDemo === 'chat' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
                                Conversation Example
                            </h3>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            ChatBot Interface
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-80 overflow-y-auto p-4">
                                    {sampleConversation.map((msg, index) => (
                                        <div 
                                            key={index} 
                                            className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div 
                                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                                    msg.role === 'user' 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                                                }`}
                                            >
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="border-t border-slate-200 p-3 dark:border-slate-700">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Ask about your fitness goals..." 
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" 
                                            disabled 
                                        />
                                        <button className="rounded-lg bg-blue-500 px-3 py-2 text-white">
                                            <Zap size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
                                Sample Workout Plans
                            </h3>
                            
                            <div className="space-y-4">
                                {workoutPlans.map(plan => (
                                    <div 
                                        key={plan.id} 
                                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {plan.name}
                                            </h4>
                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {plan.level}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <ScrollText size={16} />
                                                <span>{plan.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Dumbbell size={16} />
                                                <span>{plan.exercises} exercises</span>
                                            </div>
                                        </div>
                                        
                                        <button className="flex w-full items-center justify-center rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                                            <Eye size={16} className="mr-2" />
                                            Preview Plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4">
                                <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
                                    Nutrition Recommendations
                                </h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={nutritionCategories}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {nutritionCategories.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* RepBot Demo Content */}
                {activeDemo === 'repbot' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
                                Form Analysis Examples
                            </h3>
                            
                            <div className="space-y-4">
                                {formAnalysisExamples.map(example => (
                                    <div 
                                        key={example.id} 
                                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                                                <Dumbbell size={20} />
                                            </div>
                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {example.exercise}
                                            </h4>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="mb-1 text-sm font-medium text-red-600 dark:text-red-400">
                                                Issues Detected:
                                            </div>
                                            <ul className="ml-5 list-disc text-sm text-slate-600 dark:text-slate-400">
                                                {example.issues.map((issue, idx) => (
                                                    <li key={idx}>{issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <div className="mb-1 text-sm font-medium text-green-600 dark:text-green-400">
                                                Form Tips:
                                            </div>
                                            <ul className="ml-5 list-disc text-sm text-slate-600 dark:text-slate-400">
                                                {example.tips.map((tip, idx) => (
                                                    <li key={idx}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
                                Workout Form Analysis
                            </h3>
                            
                            <div className="mb-6 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={workoutAnalysisData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                                borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                                                color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                                            }} 
                                        />
                                        <Bar dataKey="correct" stackId="a" fill="#10b981" name="Correct Form %" />
                                        <Bar dataKey="incorrect" stackId="a" fill="#ef4444" name="Needs Improvement %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                                <h3 className="mb-3 text-lg font-medium text-slate-900 dark:text-white">
                                    How RepBot Works
                                </h3>
                                
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                                            1
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            Record or upload a video of your workout
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                                            2
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            AI analyzes your movement patterns and body alignment
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                                            3
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            Get detailed feedback and specific recommendations
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                                            4
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            Track progress as your form improves over time
                                        </p>
                                    </div>
                                </div>
                                
                                <button className="mt-2 w-full rounded-lg bg-green-600 py-2 text-center text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                                    Try RepBot Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Access Tiles */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <a href="/chatbot" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                        <div className="mb-2 flex justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                <MessageSquare size={20} />
                            </div>
                            <ChevronRight size={20} className="text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white">ChatBot</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Get personalized fitness advice through natural conversation
                        </p>
                    </div>
                </a>
                
                <a href="/repbot" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-1 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                        <div className="mb-2 flex justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                                <Camera size={20} />
                            </div>
                            <ChevronRight size={20} className="text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white">RepBot</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Analyze your workout form to improve technique and results
                        </p>
                    </div>
                </a>
                
                <a href="#" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-1 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                        <div className="mb-2 flex justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                                <User size={20} />
                            </div>
                            <ChevronRight size={20} className="text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Profile</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Customize your fitness profile and preferences
                        </p>
                    </div>
                </a>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;