/**
 * WorkoutService - Handles all interactions with workout data in localStorage
 */
export const WorkoutService = {
    /**
     * Get all workouts sorted by date (newest first)
     */
    getAllWorkouts: () => {
      try {
        const workouts = JSON.parse(localStorage.getItem('workout_history') || '[]');
        return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (error) {
        console.error('Error fetching workouts:', error);
        return [];
      }
    },
  
    /**
     * Get detailed workout log for a specific workout
     */
    getWorkoutDetails: (workoutId) => {
      try {
        return JSON.parse(localStorage.getItem(`workout_details_${workoutId}`) || '[]');
      } catch (error) {
        console.error('Error fetching workout details:', error);
        return [];
      }
    },
  
    /**
     * Save a new workout
     */
    saveWorkout: (workout) => {
      try {
        // Get existing workouts
        const workouts = WorkoutService.getAllWorkouts();
        
        // Check if workout with this ID already exists
        const existingIndex = workouts.findIndex(w => w.id === workout.id);
        
        if (existingIndex >= 0) {
          // Update existing workout
          workouts[existingIndex] = workout;
        } else {
          // Add new workout
          workouts.push(workout);
        }
        
        // Save to localStorage
        localStorage.setItem('workout_history', JSON.stringify(workouts));
        
        return true;
      } catch (error) {
        console.error('Error saving workout:', error);
        return false;
      }
    },
  
    /**
     * Save detailed workout log
     */
    saveWorkoutDetails: (workoutId, details) => {
      try {
        localStorage.setItem(`workout_details_${workoutId}`, JSON.stringify(details));
        return true;
      } catch (error) {
        console.error('Error saving workout details:', error);
        return false;
      }
    },
  
    /**
     * Delete a workout and its details
     */
    deleteWorkout: (workoutId) => {
      try {
        // Get current workouts
        const workouts = WorkoutService.getAllWorkouts();
        
        // Filter out the workout to delete
        const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
        
        // Save updated list
        localStorage.setItem('workout_history', JSON.stringify(updatedWorkouts));
        
        // Remove workout details
        localStorage.removeItem(`workout_details_${workoutId}`);
        
        return true;
      } catch (error) {
        console.error('Error deleting workout:', error);
        return false;
      }
    },
  
    /**
     * Calculate overall workout statistics
     */
    getWorkoutStats: () => {
      try {
        const workouts = WorkoutService.getAllWorkouts();
        
        if (workouts.length === 0) {
          return {
            totalWorkouts: 0,
            totalExercises: 0,
            mostPopularExercise: "",
            thisWeekCount: 0
          };
        }
        
        // Calculate total workouts
        const totalWorkouts = workouts.length;
        
        // Calculate total exercises
        const exercises = workouts.flatMap(workout => workout.exercises || []);
        const totalExercises = exercises.reduce((sum, ex) => sum + ex.reps, 0);
        
        // Find most popular exercise
        const exerciseCounts = {};
        exercises.forEach(ex => {
          exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + 1;
        });
        
        let mostPopular = "";
        let highestCount = 0;
        
        Object.entries(exerciseCounts).forEach(([name, count]) => {
          if (count > highestCount) {
            mostPopular = name;
            highestCount = count;
          }
        });
        
        // Calculate workouts this week
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const thisWeekWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= oneWeekAgo;
        });
        
        return {
          totalWorkouts,
          totalExercises,
          mostPopularExercise: mostPopular,
          thisWeekCount: thisWeekWorkouts.length
        };
      } catch (error) {
        console.error('Error calculating workout stats:', error);
        return {
          totalWorkouts: 0,
          totalExercises: 0,
          mostPopularExercise: "",
          thisWeekCount: 0
        };
      }
    }
  };
  
  export default WorkoutService;