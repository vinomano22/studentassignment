
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, isPast, parseISO } from 'date-fns';
import { Assignment } from '@/lib/data';
import { motion } from 'framer-motion';
import { CalendarIcon, BookIcon, ArrowRightIcon } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  index: number;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, index }) => {
  const dueDate = parseISO(assignment.dueDate);
  const isPastDue = isPast(dueDate);
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/assignment/${assignment.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      whileHover={{ y: -4 }}
      className="glass-card group rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex justify-between items-start">
          <div className="chip">
            <BookIcon className="h-3 w-3 mr-1" />
            {assignment.course}
          </div>
          <div className={`chip ${
            assignment.status === 'Submitted' 
              ? 'bg-green-100 text-green-800' 
              : isPastDue 
                ? 'bg-red-100 text-red-800' 
                : 'bg-purple-100 text-purple-800'
          }`}>
            {assignment.status}
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
          {assignment.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {assignment.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center text-xs text-muted-foreground mb-4">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Due: {format(dueDate, 'MMMM d, yyyy')}</span>
            <span className="mx-2">•</span>
            <span>{assignment.points} points</span>
          </div>
          
          <div 
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              navigate(`/assignment/${assignment.id}`);
            }}
          >
            View Details
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="ml-1"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </motion.span>
          </div>
        </div>
      </div>
      
      <div 
        className={`h-1 w-full ${
          assignment.status === 'Submitted' 
            ? 'bg-green-500' 
            : isPastDue 
              ? 'bg-red-500' 
              : 'bg-primary'
        }`}
      />
    </motion.div>
  );
};

export default AssignmentCard;
