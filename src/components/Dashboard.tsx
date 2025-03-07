
import React from 'react';
import { motion } from 'framer-motion';
import { Assignment } from '@/lib/data';
import { parseISO, isPast, isToday } from 'date-fns';
import { CheckCircle, Clock, AlertTriangle, BookOpen } from 'lucide-react';

interface DashboardProps {
  assignments: Assignment[];
}

const Dashboard: React.FC<DashboardProps> = ({ assignments }) => {
  // Calculate summary statistics
  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter(a => a.status === 'Submitted').length;
  const pendingAssignments = assignments.filter(a => a.status !== 'Submitted').length;
  const overdueAssignments = assignments.filter(a => 
    a.status !== 'Submitted' && 
    isPast(parseISO(a.dueDate)) && 
    !isToday(parseISO(a.dueDate))
  ).length;
  const dueTodayAssignments = assignments.filter(a => 
    a.status !== 'Submitted' && 
    isToday(parseISO(a.dueDate))
  ).length;
  
  // Calculate completion percentage
  const completionPercentage = totalAssignments > 0 
    ? Math.round((submittedAssignments / totalAssignments) * 100) 
    : 0;
  
  // List of courses
  const courses = [...new Set(assignments.map(a => a.course))];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 mb-8"
    >
      <h2 className="text-xl font-medium mb-6">Dashboard Summary</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card bg-blue-50/50 p-4 rounded-xl flex items-center">
          <BookOpen className="h-10 w-10 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Total Assignments</p>
            <p className="text-2xl font-medium">{totalAssignments}</p>
          </div>
        </div>
        
        <div className="glass-card bg-green-50/50 p-4 rounded-xl flex items-center">
          <CheckCircle className="h-10 w-10 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-2xl font-medium">{submittedAssignments}</p>
          </div>
        </div>
        
        <div className="glass-card bg-orange-50/50 p-4 rounded-xl flex items-center">
          <Clock className="h-10 w-10 text-orange-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Due Today</p>
            <p className="text-2xl font-medium">{dueTodayAssignments}</p>
          </div>
        </div>
        
        <div className="glass-card bg-red-50/50 p-4 rounded-xl flex items-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-2xl font-medium">{overdueAssignments}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-xl mb-4">
        <p className="text-sm text-muted-foreground mb-2">Overall Completion</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-primary h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm mt-1">{completionPercentage}% Complete</p>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Your Courses ({courses.length})</p>
        <div className="flex flex-wrap gap-2">
          {courses.map((course, index) => (
            <span key={index} className="chip bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
              {course}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
