import { Brain } from "lucide-react";
import { Footer } from "@/layouts/footer";
import AiWorkoutGenerator from "@/components/AiWorkoutGenerator";

const AiWorkoutPage = () => {
    return (
        <div className="flex flex-col gap-y-6">
            {/* Header */}
            <div className="flex items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c] text-white">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h1 className="title">AI Workout Generator</h1>
                        <p className="text-slate-600 text-sm">Get personalized workouts based on AI analysis</p>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <AiWorkoutGenerator />

            <Footer />
        </div>
    );
};

export default AiWorkoutPage;