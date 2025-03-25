import { useState } from "react";
import { 
  Camera, 
  ChevronRight, 
  Shield, 
  CheckCircle, 
  Clock, 
  Award, 
  PlayCircle, 
  Zap, 
  Activity, 
  BarChart2,
  Info,
  Eye,
  ArrowRight,
  HeartPulse,
  Users
} from "lucide-react";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";

// Use the specified image for all exercise demonstrations
const REPBOT_IMAGE = "/repbot_image.png";

// Exercise types supported by RepBot
const SUPPORTED_EXERCISES = [
  { 
    name: "Bicep Curl", 
    description: "Tracks elbow angle and arm position",
    image: REPBOT_IMAGE
  },
  { 
    name: "Squat", 
    description: "Analyzes knee angles and hip position",
    image: REPBOT_IMAGE
  },
  { 
    name: "Push-up", 
    description: "Monitors body alignment and arm angles",
    image: REPBOT_IMAGE
  },
  { 
    name: "Shoulder Press", 
    description: "Tracks shoulder and elbow movement",
    image: REPBOT_IMAGE
  },
  { 
    name: "Sit-up", 
    description: "Analyzes torso angle and movement",
    image: REPBOT_IMAGE
  },
  { 
    name: "Jumping Jacks", 
    description: "Monitors full-body coordination",
    image: REPBOT_IMAGE
  },
  { 
    name: "Lunge", 
    description: "Tracks knee angles and stance position",
    image: REPBOT_IMAGE
  }
];

// Benefits of using RepBot
const BENEFITS = [
  { 
    icon: <Shield size={24} />,
    title: "Injury Prevention", 
    description: "Get real-time form corrections to reduce injury risk"
  },
  { 
    icon: <CheckCircle size={24} />,
    title: "Perfect Form", 
    description: "Learn proper technique with instant feedback"
  },
  { 
    icon: <Clock size={24} />,
    title: "Efficient Workouts", 
    description: "Make every rep count with precise tracking"
  },
  { 
    icon: <Award size={24} />,
    title: "Track Progress", 
    description: "Monitor improvements in form and strength over time"
  }
];

// How RepBot works
const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Start Your Camera",
    description: "Enable camera access to begin form analysis",
    icon: <Camera />
  },
  {
    step: 2,
    title: "Select Exercise",
    description: "Choose from multiple supported exercises",
    icon: <Activity />
  },
  {
    step: 3,
    title: "Real-time Analysis",
    description: "AI analyzes your movement patterns instantly",
    icon: <Zap />
  },
  {
    step: 4,
    title: "Get Feedback",
    description: "Receive corrections and rep counting automatically",
    icon: <BarChart2 />
  }
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "RepBot helped me perfect my squats when I couldn't get to the gym for personal training.",
    name: "Alex Johnson",
    role: "Fitness Enthusiast",
    avatar: "/src/assets/profile-image.jpg" // Using existing project avatar
  },
  {
    quote: "I've been using RepBot to track my push-ups and noticed significant form improvement in just two weeks.",
    name: "Sarah Miller",
    role: "Home Workout Fan",
    avatar: "/src/assets/profile-image.jpg"
  },
  {
    quote: "As a beginner, I was doing bicep curls completely wrong. RepBot's feedback was a game-changer.",
    name: "Mark Thompson",
    role: "Fitness Beginner",
    avatar: "/src/assets/profile-image.jpg"
  }
];

const RepBotPage = () => {
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQ items
  const faqItems = [
    {
      question: "Is my workout data stored or shared?",
      answer: "No. RepBot processes all data locally in your browser. Your video is never stored or sent to any server, ensuring complete privacy."
    },
    {
      question: "Does RepBot work on mobile devices?",
      answer: "Yes, RepBot works on smartphones and tablets with a camera and modern browser. For best results, position your device to capture your full body during exercises."
    },
    {
      question: "How accurate is the form analysis?",
      answer: "RepBot uses advanced pose estimation technology to track key body points. While not perfect, it provides valuable guidance for most common exercises to help you improve your technique."
    },
    {
      question: "Can I use RepBot at home without equipment?",
      answer: "Absolutely! Many of the supported exercises require minimal or no equipment, making it perfect for home workouts. Just ensure you have enough space for the camera to capture your movements."
    }
  ];

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 shadow-lg text-white">
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-16 items-center">
            <div>
              <div className="mb-3 inline-block rounded-lg bg-blue-500/40 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                AI-Powered Form Analysis
              </div>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl tracking-tight">
                Perfect Your <span className="text-blue-200">Exercise Form</span> with AI Technology
              </h1>
              <p className="mb-8 text-lg text-blue-100">
                RepBot uses advanced computer vision to analyze your movements, count reps, and provide real-time feedback to improve your technique and prevent injuries.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/repbot/start" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <Camera className="mr-2 h-5 w-5" />
                  Launch RepBot
                </a>
                <button 
                  onClick={() => {
                    const howItWorksSection = document.getElementById('how-it-works');
                    howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-700/50 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700/70 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                >
                  <Info className="mr-2 h-5 w-5" />
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src={REPBOT_IMAGE} 
                  alt="RepBot Form Analysis" 
                  className="h-full w-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-indigo-900/80 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/30 backdrop-blur-sm">
                      <Camera size={40} className="text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">AI Form Analysis</h3>
                    <p className="mb-6 mx-auto max-w-xs text-blue-200">RepBot tracks your movement in real-time and provides instant feedback</p>
                    <div className="inline-flex items-center justify-center rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
                      <span>7 Exercises Supported</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center rounded-xl bg-blue-50 p-6 shadow-sm dark:bg-slate-800">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exercises Tracked</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">7+</p>
          </div>
        </div>
        <div className="flex items-center rounded-xl bg-blue-50 p-6 shadow-sm dark:bg-slate-800">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <HeartPulse size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Form Corrections</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Real-time</p>
          </div>
        </div>
        <div className="flex items-center rounded-xl bg-blue-50 p-6 shadow-sm dark:bg-slate-800">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Privacy</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</p>
          </div>
        </div>
        <div className="flex items-center rounded-xl bg-blue-50 p-6 shadow-sm dark:bg-slate-800">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Setup Time</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">&lt; 1 min</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white text-center">
          Why Use RepBot?
        </h2>
        <p className="mb-8 text-center text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Our AI technology helps you achieve better results by ensuring proper form and technique during your workouts
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <div 
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-white">
          How RepBot Works
        </h2>
        <p className="mb-10 text-center text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Simple steps to get started with AI-powered form analysis
        </p>
        
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-100 hidden lg:block dark:bg-blue-900/30"></div>
          
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item.step} className="relative flex flex-col items-center">
                <div className="z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white ring-8 ring-blue-100 dark:bg-slate-800 dark:ring-blue-900/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="absolute top-0 right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white lg:translate-x-2 lg:-translate-y-2">
                  {item.step}
                </div>
                <h3 className="mb-2 text-center text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-center text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exercise Preview */}
      <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          Exercises You Can Master
        </h2>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Select an exercise to learn how RepBot can help you improve your form
        </p>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {SUPPORTED_EXERCISES.map((exercise, index) => (
                <div
                  key={index}
                  className={cn(
                    "cursor-pointer rounded-lg p-4 transition-all",
                    selectedExercise === index
                      ? "bg-blue-50 shadow-sm dark:bg-blue-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setSelectedExercise(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      "font-medium",
                      selectedExercise === index
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-slate-900 dark:text-white"
                    )}>
                      {exercise.name}
                    </h3>
                    <ChevronRight 
                      size={18} 
                      className={cn(
                        "transition-colors",
                        selectedExercise === index 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-slate-400"
                      )} 
                    />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{exercise.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
              <div className="aspect-video relative">
                <img
                  src={REPBOT_IMAGE}
                  alt={`${SUPPORTED_EXERCISES[selectedExercise].name} demonstration`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/70 to-slate-900/90">
                  <div className="text-center p-6">
                    <h3 className="mb-3 text-2xl font-bold text-white">{SUPPORTED_EXERCISES[selectedExercise].name}</h3>
                    <p className="mb-6 max-w-md mx-auto text-blue-200">
                      RepBot's AI technology analyzes your joint angles, movement patterns, and body positioning to provide precise feedback on your {SUPPORTED_EXERCISES[selectedExercise].name.toLowerCase()} form.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
                        <PlayCircle size={18} className="mr-2" />
                        Watch Demo
                      </button>
                      <a 
                        href="/repbot/start"
                        className="inline-flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20"
                      >
                        <Camera size={18} className="mr-2" />
                        Try It Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 dark:bg-slate-800">
                <h4 className="font-medium text-slate-900 dark:text-white">What RepBot Tracks:</h4>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex items-center">
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <CheckCircle size={14} />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Joint angles</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <CheckCircle size={14} />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Movement patterns</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <CheckCircle size={14} />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Rep counting</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <CheckCircle size={14} />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Form corrections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Demonstration */}
      <section className="rounded-xl bg-slate-100 p-8 dark:bg-slate-800/50">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">
          See RepBot in Action
        </h2>
        
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl shadow-lg">
          <img 
            src={REPBOT_IMAGE} 
            alt="RepBot Form Analysis in Action" 
            className="w-full h-auto object-cover rounded-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110">
              <PlayCircle size={40} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800">
        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="mx-auto max-w-3xl space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="rounded-lg border border-slate-200 overflow-hidden dark:border-slate-700"
            >
              <button 
                className="flex w-full items-center justify-between bg-slate-50 p-4 text-left text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-medium">{item.question}</h3>
                <ChevronRight 
                  size={18} 
                  className={cn(
                    "text-slate-500 transition-transform",
                    expandedFaq === index ? "rotate-90" : ""
                  )} 
                />
              </button>
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  expandedFaq === index ? "max-h-40" : "max-h-0"
                )}
              >
                <p className="p-4 text-slate-600 dark:text-slate-400">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-lg text-white">
        <h2 className="mb-8 text-2xl font-bold text-center text-white">
          What Users Are Saying
        </h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index}
              className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="mb-6 italic text-blue-100">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="mr-4 h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-sm text-blue-200">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-xl overflow-hidden shadow-lg relative">
        <img 
          src={REPBOT_IMAGE} 
          alt="RepBot Form Analysis" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-blue-900/70 to-black/50 flex items-center justify-center">
          <div className="text-center px-4 py-8">
            <h2 className="mb-3 text-3xl font-bold text-white">
              Ready to Perfect Your Form?
            </h2>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-blue-100">
              Start using RepBot today and transform your workouts with AI-powered form analysis and real-time feedback.
            </p>
            <a 
              href="/repbot/start" 
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Eye size={20} className="mr-2" />
              Try RepBot Now
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RepBotPage;