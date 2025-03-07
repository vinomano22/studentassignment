
import React, { useState, useMemo } from 'react';
import { Assignment } from '@/lib/data';
import AssignmentCard from './AssignmentCard';
import { motion } from 'framer-motion';
import { SearchIcon, FilterIcon, CalendarIcon, ArrowDownAZ, ArrowUpAZ, Clock } from 'lucide-react';
import { parseISO, isPast, isToday, format } from 'date-fns';

interface AssignmentListProps {
  assignments: Assignment[];
  isLoading: boolean;
}

type SortOption = 'title-asc' | 'title-desc' | 'date-asc' | 'date-desc' | 'course-asc' | 'course-desc';

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  
  const filteredAndSortedAssignments = useMemo(() => {
    // First filter the assignments
    const filtered = assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatusFilter = statusFilter === 'all' || 
                            (statusFilter === 'submitted' && assignment.status === 'Submitted') ||
                            (statusFilter === 'pending' && assignment.status !== 'Submitted') ||
                            (statusFilter === 'not-started' && assignment.status === 'Not Started');
      
      const dueDate = parseISO(assignment.dueDate);
      const matchesDateFilter = dateFilter === 'all' || 
                            (dateFilter === 'past-due' && isPast(dueDate) && !isToday(dueDate)) ||
                            (dateFilter === 'due-today' && isToday(dueDate)) ||
                            (dateFilter === 'upcoming' && !isPast(dueDate));
      
      return matchesSearch && matchesStatusFilter && matchesDateFilter;
    });
    
    // Then sort the filtered assignments
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
          return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
        case 'date-desc':
          return parseISO(b.dueDate).getTime() - parseISO(a.dueDate).getTime();
        case 'course-asc':
          return a.course.localeCompare(b.course);
        case 'course-desc':
          return b.course.localeCompare(a.course);
        default:
          return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
      }
    });
  }, [assignments, searchTerm, statusFilter, dateFilter, sortBy]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">Your Assignments</h2>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input appearance-none pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="pending">In Progress</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
        
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="glass-input appearance-none pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="all">All Dates</option>
            <option value="past-due">Past Due</option>
            <option value="due-today">Due Today</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        
        <div className="relative">
          {sortBy.includes('asc') ? (
            <ArrowDownAZ className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          ) : (
            <ArrowUpAZ className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="glass-input appearance-none pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="date-asc">Date (Earliest)</option>
            <option value="date-desc">Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="course-asc">Course (A-Z)</option>
            <option value="course-desc">Course (Z-A)</option>
          </select>
        </div>
      </div>
      
      {filteredAndSortedAssignments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <p className="text-lg text-muted-foreground">No assignments found.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedAssignments.map((assignment, index) => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AssignmentList;
