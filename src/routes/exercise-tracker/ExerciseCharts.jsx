import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import WorkoutService from '@/services/workout-service';

const COLORS = ['#1e628c', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f43f5e'];

const ExerciseCharts = () => {
  const [chartData, setChartData] = useState({
    weeklyWorkouts: [],
    exerciseDistribution: []
  });

  useEffect(() => {
    // Load workout data for visualization
    const workouts = WorkoutService.getAllWorkouts();
    
    if (workouts.length === 0) return;
    
    // Prepare data for weekly chart
    const weeklyData = prepareWeeklyData(workouts);
    
    // Prepare data for exercise distribution
    const distributionData = prepareExerciseDistribution(workouts);
    
    setChartData({
      weeklyWorkouts: weeklyData,
      exerciseDistribution: distributionData
    });
  }, []);

  // Prepare data for weekly chart
  const prepareWeeklyData = (workouts) => {
    // Get dates for the last 14 days
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push({
        date: date,
        dateStr: date.toISOString().split('T')[0],
        count: 0,
        exerciseCount: 0
      });
    }
    
    // Count workouts and exercises for each day
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      const workoutDateStr = workoutDate.toISOString().split('T')[0];
      
      const matchingDay = dates.find(d => d.dateStr === workoutDateStr);
      if (matchingDay) {
        matchingDay.count += 1;
        matchingDay.exerciseCount += workout.exercises?.length || 0;
      }
    });
    
    // Format dates for display
    return dates.map(d => ({
      date: d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      workouts: d.count,
      exercises: d.exerciseCount
    }));
  };

  // Prepare data for exercise distribution
  const prepareExerciseDistribution = (workouts) => {
    const exercises = workouts.flatMap(workout => workout.exercises || []);
    const exerciseCounts = {};
    
    exercises.forEach(ex => {
      if (!exerciseCounts[ex.name]) {
        exerciseCounts[ex.name] = 0;
      }
      exerciseCounts[ex.name] += ex.reps;
    });
    
    return Object.entries(exerciseCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // Get top 7 exercises
  };

  if (chartData.weeklyWorkouts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-slate-500">
        No workout data available for visualization
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Activity Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.weeklyWorkouts}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="workouts" 
                name="Workouts" 
                stroke="#1e628c" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="exercises" 
                name="Exercises" 
                stroke="#f97316" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Exercise Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Exercise Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.exerciseDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Reps" fill="#1e628c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Exercise Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.exerciseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.exerciseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reps`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCharts;