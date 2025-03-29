import React from 'react';
import { X, Trophy, Calendar, Clock, BarChart } from 'lucide-react';

const WorkoutSummaryModal = ({ workout, onClose, onViewHistory }) => {
  if (!workout) return null;

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time (convert seconds to minutes:seconds)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate total reps
  const totalReps = workout.exercises.reduce((sum, exercise) => sum + exercise.reps, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#1e628c] p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Workout Summary</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Trophy Icon */}
        <div className="flex justify-center my-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        {/* Congratulations Message */}
        <div className="text-center px-6 pb-4">
          <h3 className="text-xl font-bold text-gray-800">Great Job!</h3>
          <p className="text-gray-600 mt-1">You've completed your workout</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 p-4 border-t border-gray-200">
          <div className="flex flex-col items-center">
            <Calendar className="h-5 w-5 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Date</span>
            <span className="font-medium text-gray-800 text-sm text-center">
              {formatDate(workout.date)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Clock className="h-5 w-5 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Duration</span>
            <span className="font-medium text-gray-800 text-sm">
              {formatDuration(workout.duration || 0)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <BarChart className="h-5 w-5 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Total Reps</span>
            <span className="font-medium text-gray-800 text-sm">{totalReps}</span>
          </div>
        </div>

        {/* Exercise List */}
        <div className="px-4 pb-4 pt-2">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Exercises Completed</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="bg-gray-50 rounded p-2 flex justify-between items-center">
                <span className="text-gray-800">{exercise.name}</span>
                <span className="bg-[#1e628c] text-white px-2 py-1 rounded-full text-xs font-medium">
                  {exercise.reps} reps
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onViewHistory}
            className="flex-1 py-3 bg-[#1e628c] text-white font-medium hover:bg-[#13496a]"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSummaryModal;