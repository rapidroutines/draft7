import { useState, useEffect } from 'react';
import { Dumbbell, Brain, Clock, Flame, Target, Award, RefreshCw, Send, User } from 'lucide-react';

const AiWorkoutGenerator = () => {
  // States for form inputs and results
  const [formData, setFormData] = useState({
    fitnessLevel: 'intermediate',
    duration: 30,
    focus: 'strength',
    equipment: 'minimal',
    injuries: '',
    goal: 'general fitness'
  });
  
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousWorkouts, setPreviousWorkouts] = useState([]);
  
  // Load previous workouts from localStorage
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('previousWorkouts');
    if (savedWorkouts) {
      try {
        setPreviousWorkouts(JSON.parse(savedWorkouts));
      } catch (err) {
        console.error('Error loading previous workouts:', err);
      }
    }
  }, []);
  
  // Save workouts to localStorage when they change
  useEffect(() => {
    if (previousWorkouts.length > 0) {
      localStorage.setItem('previousWorkouts', JSON.stringify(previousWorkouts));
    }
  }, [previousWorkouts]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate workout function - simulates API call
  const generateWorkout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be a fetch to your backend API
      // that would run the machine learning model
      const response = await simulateApiCall(formData);
      
      setWorkout(response);
      
      // Add to previous workouts
      setPreviousWorkouts(prev => {
        // Only keep the last 5 workouts
        const updatedWorkouts = [response, ...prev].slice(0, 5);
        return updatedWorkouts;
      });
      
    } catch (err) {
      setError('Error generating workout. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to simulate backend API call with ML workout generation
  const simulateApiCall = (data) => {
    // This simulates the latency of an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This simulates the response you'd get from a backend ML model
        const workoutTemplates = {
          beginner: {
            strength: {
              minimal: [
                { name: 'Push-ups', sets: 3, reps: '8-10', rest: '60s' },
                { name: 'Bodyweight Squats', sets: 3, reps: '12-15', rest: '60s' },
                { name: 'Plank', sets: 3, reps: '30s hold', rest: '45s' },
                { name: 'Glute Bridges', sets: 3, reps: '12-15', rest: '60s' },
                { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '45s' }
              ],
              full: [
                { name: 'Dumbbell Bench Press', sets: 3, reps: '10-12', rest: '60s' },
                { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: '60s' },
                { name: 'Dumbbell Rows', sets: 3, reps: '10-12 each side', rest: '60s' },
                { name: 'Kettlebell Deadlifts', sets: 3, reps: '10-12', rest: '60s' },
                { name: 'Plank', sets: 3, reps: '30s hold', rest: '45s' }
              ]
            },
            cardio: {
              minimal: [
                { name: 'Jumping Jacks', sets: 3, reps: '30s', rest: '30s' },
                { name: 'High Knees', sets: 3, reps: '30s', rest: '30s' },
                { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '30s' },
                { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s' },
                { name: 'Burpees (Modified)', sets: 3, reps: '8-10', rest: '45s' }
              ],
              full: [
                { name: 'Treadmill Intervals', sets: 5, reps: '1 min fast, 2 min slow', rest: 'None' },
                { name: 'Cycling', sets: 1, reps: '15 minutes steady state', rest: 'None' },
                { name: 'Kettlebell Swings', sets: 3, reps: '15', rest: '45s' },
                { name: 'Jump Rope', sets: 3, reps: '1 minute', rest: '45s' },
                { name: 'Bodyweight Squats', sets: 3, reps: '20', rest: '30s' }
              ]
            }
          },
          intermediate: {
            strength: {
              minimal: [
                { name: 'Push-ups (Diamond)', sets: 4, reps: '10-12', rest: '60s' },
                { name: 'Pistol Squats (Assisted)', sets: 3, reps: '8-10 each leg', rest: '60s' },
                { name: 'Pull-ups or Inverted Rows', sets: 3, reps: '8-10', rest: '90s' },
                { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
                { name: 'Plank Variations', sets: 3, reps: '45s hold', rest: '45s' }
              ],
              full: [
                { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s' },
                { name: 'Barbell Back Squats', sets: 4, reps: '8-10', rest: '120s' },
                { name: 'Bent-Over Rows', sets: 4, reps: '10-12', rest: '90s' },
                { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '90s' },
                { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '60s' }
              ]
            },
            cardio: {
              minimal: [
                { name: 'Burpees', sets: 4, reps: '12-15', rest: '45s' },
                { name: 'Mountain Climbers', sets: 4, reps: '45s', rest: '30s' },
                { name: 'Jump Squats', sets: 3, reps: '15-20', rest: '45s' },
                { name: 'Plank to Push-up', sets: 3, reps: '10-12', rest: '45s' },
                { name: 'High Knees', sets: 4, reps: '45s', rest: '30s' }
              ],
              full: [
                { name: 'Treadmill HIIT', sets: 6, reps: '30s sprint, 90s jog', rest: 'None' },
                { name: 'Rowing Machine', sets: 1, reps: '500m x 5', rest: '60s between' },
                { name: 'Battle Ropes', sets: 4, reps: '30s', rest: '30s' },
                { name: 'Box Jumps', sets: 4, reps: '12', rest: '45s' },
                { name: 'Kettlebell Swings', sets: 3, reps: '20', rest: '45s' }
              ]
            }
          },
          advanced: {
            strength: {
              minimal: [
                { name: 'One-Arm Push-ups (Progression)', sets: 4, reps: '6-8 each arm', rest: '60s' },
                { name: 'Pistol Squats', sets: 4, reps: '6-8 each leg', rest: '60s' },
                { name: 'Pull-ups (Weighted or L-sit)', sets: 4, reps: '8-10', rest: '90s' },
                { name: 'Single-Leg Deadlifts', sets: 3, reps: '8-10 each leg', rest: '60s' },
                { name: 'Handstand Push-ups (Wall)', sets: 3, reps: '6-8', rest: '90s' }
              ],
              full: [
                { name: 'Barbell Bench Press', sets: 5, reps: '5-8', rest: '120s' },
                { name: 'Barbell Back Squats', sets: 5, reps: '5-8', rest: '180s' },
                { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '120s' },
                { name: 'Deadlifts', sets: 4, reps: '5-8', rest: '180s' },
                { name: 'Overhead Press', sets: 4, reps: '6-8', rest: '120s' }
              ]
            },
            cardio: {
              minimal: [
                { name: 'Burpee Pull-ups', sets: 5, reps: '10', rest: '60s' },
                { name: 'Plyo Push-ups', sets: 4, reps: '10-12', rest: '60s' },
                { name: 'Box Jumps (Using chair/step)', sets: 4, reps: '15', rest: '60s' },
                { name: 'Handstand Hold (Wall)', sets: 4, reps: '30s', rest: '60s' },
                { name: 'Split Jump Lunges', sets: 4, reps: '20 total', rest: '60s' }
              ],
              full: [
                { name: 'Assault Bike Intervals', sets: 8, reps: '20s max effort, 40s recovery', rest: 'None' },
                { name: 'Treadmill Sprints', sets: 8, reps: '30s max effort, 90s recovery', rest: 'None' },
                { name: 'Kettlebell Complex', sets: 5, reps: 'Circuit of 5 exercises', rest: '90s between sets' },
                { name: 'Box Jumps', sets: 5, reps: '10 high impact', rest: '60s' },
                { name: 'Battle Ropes', sets: 5, reps: '30s', rest: '30s' }
              ]
            }
          }
        };

        // Based on the user's inputs, select the appropriate workout
        const levelWorkouts = workoutTemplates[data.fitnessLevel] || workoutTemplates.intermediate;
        const focusWorkouts = levelWorkouts[data.focus] || levelWorkouts.strength;
        const equipmentWorkouts = focusWorkouts[data.equipment] || focusWorkouts.minimal;
        
        // Add some personalization based on other factors
        let adjustedWorkout = [...equipmentWorkouts];
        
        // If they mentioned injuries, modify the workout (simple example)
        if (data.injuries.toLowerCase().includes('knee')) {
          // Replace squats and lunges with alternatives
          adjustedWorkout = adjustedWorkout.map(exercise => {
            if (exercise.name.includes('Squat') || exercise.name.includes('Lunge')) {
              return { name: 'Seated Leg Extensions (Light)', sets: exercise.sets, reps: exercise.reps, rest: exercise.rest, note: 'Modified for knee injury' };
            }
            return exercise;
          });
        }
        
        // Adjust workout duration
        const targetDuration = parseInt(data.duration);
        if (targetDuration < 30) {
          // For shorter workouts, reduce sets
          adjustedWorkout = adjustedWorkout.map(exercise => ({
            ...exercise,
            sets: Math.max(2, exercise.sets - 1)
          }));
        } else if (targetDuration > 45) {
          // For longer workouts, add some additional exercises
          if (data.focus === 'strength') {
            adjustedWorkout.push({ 
              name: 'Resistance Band Pull-Aparts', 
              sets: 3, 
              reps: '15-20', 
              rest: '45s' 
            });
          } else {
            adjustedWorkout.push({ 
              name: 'Jumping Jacks', 
              sets: 2, 
              reps: '60s', 
              rest: '30s' 
            });
          }
        }
        
        // Calculate estimated calories burned - this would be from an ML model in real implementation
        const estimatedCalories = calculateEstimatedCalories(data, adjustedWorkout);
        
        const result = {
          id: Date.now(),
          date: new Date().toISOString(),
          workout: adjustedWorkout,
          parameters: {...data},
          duration: targetDuration,
          estimatedCalories: estimatedCalories,
          focusArea: data.focus,
          difficulty: data.fitnessLevel,
          title: generateWorkoutTitle(data)
        };
        
        resolve(result);
      }, 2000); // Simulate a 2 second API delay
    });
  };
  
  // Helper function to estimate calories burned
  const calculateEstimatedCalories = (data, workout) => {
    const baseCalories = {
      beginner: 5,
      intermediate: 7,
      advanced: 9
    };
    
    const focusMultiplier = {
      strength: 1.0,
      cardio: 1.4,
      'general fitness': 1.2
    };
    
    const basePerMinute = baseCalories[data.fitnessLevel] || baseCalories.intermediate;
    const multiplier = focusMultiplier[data.focus] || focusMultiplier.strength;
    
    // Calculate total sets in the workout
    const totalSets = workout.reduce((total, exercise) => total + exercise.sets, 0);
    
    // Estimate calories based on duration, intensity, and workout volume
    return Math.round(data.duration * basePerMinute * multiplier * (totalSets / 10));
  };
  
  // Helper function to generate a creative workout title
  const generateWorkoutTitle = (data) => {
    const levelTerms = {
      beginner: ['Starter', 'Intro', 'Foundation'],
      intermediate: ['Progressive', 'Builder', 'Enhancer'],
      advanced: ['Elite', 'Peak', 'Maximum']
    };
    
    const focusTerms = {
      strength: ['Power', 'Force', 'Muscle'],
      cardio: ['Endurance', 'Stamina', 'Burn'],
      'general fitness': ['Total Body', 'Complete', 'Balanced']
    };
    
    const level = levelTerms[data.fitnessLevel] ? 
      levelTerms[data.fitnessLevel][Math.floor(Math.random() * levelTerms[data.fitnessLevel].length)] : 
      'Custom';
      
    const focus = focusTerms[data.focus] ?
      focusTerms[data.focus][Math.floor(Math.random() * focusTerms[data.focus].length)] :
      'Training';
      
    return `${level} ${focus} ${data.duration}-Minute Workout`;
  };
  
  // Function to load a previous workout
  const loadPreviousWorkout = (workout) => {
    setWorkout(workout);
    setFormData(workout.parameters);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e628c] text-white">
          <Brain size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Workout Generator</h1>
          <p className="text-slate-600">Get a personalized workout plan based on your preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Customize Your Workout</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Fitness Level</label>
                <select 
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-[#1e628c] focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Workout Focus</label>
                <select 
                  name="focus"
                  value={formData.focus}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-[#1e628c] focus:outline-none"
                >
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardio & Endurance</option>
                  <option value="general fitness">General Fitness</option>
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Available Equipment</label>
                <select 
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-[#1e628c] focus:outline-none"
                >
                  <option value="minimal">Minimal Equipment</option>
                  <option value="full">Full Gym Access</option>
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Workout Duration (minutes)</label>
                <input 
                  type="range" 
                  name="duration"
                  min="15"
                  max="60"
                  step="5"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full accent-[#1e628c]"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>15 min</span>
                  <span>{formData.duration} min</span>
                  <span>60 min</span>
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Injuries or Limitations (optional)</label>
                <input 
                  type="text"
                  name="injuries"
                  value={formData.injuries}
                  onChange={handleInputChange}
                  placeholder="e.g., knee injury, lower back pain"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-[#1e628c] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Primary Goal</label>
                <select 
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-[#1e628c] focus:outline-none"
                >
                  <option value="build muscle">Build Muscle</option>
                  <option value="lose weight">Lose Weight</option>
                  <option value="improve endurance">Improve Endurance</option>
                  <option value="general fitness">General Fitness</option>
                </select>
              </div>
              
              <button
                onClick={generateWorkout}
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center rounded-md bg-[#1e628c] px-4 py-2 font-medium text-white hover:bg-[#174e70] disabled:bg-slate-400"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Workout
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Previous Workouts Section */}
          {previousWorkouts.length > 0 && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-medium text-slate-700">Previous Workouts</h3>
              <div className="space-y-2">
                {previousWorkouts.map((prevWorkout, index) => (
                  <button
                    key={prevWorkout.id || index}
                    onClick={() => loadPreviousWorkout(prevWorkout)}
                    className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm hover:bg-slate-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{prevWorkout.title}</span>
                      <span className="text-xs text-slate-600">
                        {new Date(prevWorkout.date).toLocaleDateString()} • {prevWorkout.duration} min
                      </span>
                    </div>
                    <User size={16} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column: Results */}
        <div className="lg:col-span-3">
          {workout ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              {/* Workout Header */}
              <div className="border-b border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-bold text-slate-900">{workout.title}</h2>
                <div className="mt-2 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Clock size={16} />
                    <span>{workout.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Flame size={16} />
                    <span>~{workout.estimatedCalories} calories</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Target size={16} />
                    <span>Focus: {workout.focusArea.charAt(0).toUpperCase() + workout.focusArea.slice(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Award size={16} />
                    <span>Level: {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}</span>
                  </div>
                </div>
              </div>
              
              {/* Workout Exercises */}
              <div className="p-5">
                <h3 className="mb-3 font-semibold text-slate-800">Exercise Plan</h3>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-700">Exercise</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-700">Sets</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-700">Reps</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-700">Rest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {workout.workout.map((exercise, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-slate-900">{exercise.name}</div>
                              {exercise.note && (
                                <div className="mt-1 text-xs text-slate-500">{exercise.note}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{exercise.sets}</td>
                          <td className="px-4 py-3 text-center">{exercise.reps}</td>
                          <td className="px-4 py-3 text-center">{exercise.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Workout Tips */}
                <div className="mt-5 rounded-md bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-700">Workout Tips</h4>
                  <ul className="space-y-1 text-sm text-blue-600">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <span>Begin with a 5-minute warm-up to prepare your muscles and joints.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <span>Stay hydrated throughout your workout.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <span>Focus on proper form rather than maximizing weight or speed.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <span>End with a 5-minute cooldown and stretching session.</span>
                    </li>
                  </ul>
                </div>
                
                {/* Personalized Notes */}
                {formData.injuries && (
                  <div className="mt-4 rounded-md bg-amber-50 p-4">
                    <h4 className="mb-2 font-medium text-amber-700">Personalized Notes</h4>
                    <p className="text-sm text-amber-600">
                      This workout has been adjusted based on your mentioned {formData.injuries}. 
                      If you experience any pain during exercise, stop immediately and consult a healthcare professional.
                    </p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={generateWorkout}
                    className="flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </button>
                  
                  <button 
                    onClick={() => {
                      // In a real app, this would save to a backend database
                      alert("Workout saved to your collection!");
                    }}
                    className="flex items-center rounded-md bg-[#1e628c] px-4 py-2 text-sm font-medium text-white hover:bg-[#174e70]"
                  >
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Save Workout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <Brain className="mb-3 h-12 w-12 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-700">Your AI Workout Will Appear Here</h3>
              <p className="mt-2 text-sm text-slate-500">
                Generate a personalized workout plan tailored to your preferences, fitness level, and available equipment.
              </p>
              <button
                onClick={generateWorkout}
                className="mt-6 flex items-center rounded-md bg-[#1e628c] px-4 py-2 font-medium text-white hover:bg-[#174e70]"
              >
                <Send className="mr-2 h-4 w-4" />
                Generate Workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiWorkoutGenerator;