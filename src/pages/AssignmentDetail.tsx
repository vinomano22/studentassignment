
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Assignment, fetchAssignmentById } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import SubmissionForm from '@/components/SubmissionForm';
import Navbar from '@/components/Navbar';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  BookIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

const AssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAssignment = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchAssignmentById(id);
        
        if (!data) {
          setError('Assignment not found');
          return;
        }
        
        setAssignment(data);
      } catch (err) {
        setError('Failed to load assignment details');
        toast({
          title: 'Error',
          description: 'Failed to load assignment details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignment();
  }, [id, toast]);
  
  const handleSubmissionComplete = () => {
    if (assignment) {
      setAssignment({
        ...assignment,
        status: 'Submitted'
      });
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const isPastDue = assignment ? isPast(parseISO(assignment.dueDate)) : false;
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading assignment details...</p>
      </div>
    );
  }
  
  if (error || !assignment) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-2">Assignment Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The assignment you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen pt-24 pb-16"
      >
        <div className="container mx-auto px-4">
          {/* Header for assignment view page */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-medium mb-2 text-primary">Assignment Details</h1>
            <p className="text-muted-foreground">
              Review your assignment details and submit your work
            </p>
          </motion.div>

          <motion.button
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="chip mb-2 inline-flex">
                    <BookIcon className="h-3 w-3 mr-1" />
                    {assignment.course}
                  </div>
                  <h1 className="text-3xl font-medium">{assignment.title}</h1>
                </div>
                
                <div className={`chip ${
                  assignment.status === 'Submitted' 
                    ? 'bg-green-100 text-green-800' 
                    : isPastDue 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-purple-100 text-purple-800'
                } text-sm py-1 px-3`}>
                  {assignment.status === 'Submitted' ? (
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  ) : isPastDue ? (
                    <AlertCircleIcon className="h-4 w-4 mr-1.5" />
                  ) : (
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                  )}
                  {assignment.status === 'Submitted' 
                    ? 'Submitted' 
                    : isPastDue 
                      ? 'Past Due' 
                      : 'Pending'}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-y-2 gap-x-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  <span>Due: {format(parseISO(assignment.dueDate), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <span>Points: {assignment.points}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{assignment.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Instructions</h3>
                  <div className="glass-card bg-secondary/50 p-4 rounded-lg text-muted-foreground">
                    <p>{assignment.instructions}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {assignment.status !== 'Submitted' && (
            <SubmissionForm 
              assignment={assignment} 
              onSubmissionComplete={handleSubmissionComplete} 
            />
          )}
          
          {assignment.status === 'Submitted' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl p-6 mt-8 bg-green-50/50"
            >
              <div className="flex items-center justify-center text-green-700 py-8">
                <CheckCircleIcon className="h-12 w-12 mr-4" />
                <div>
                  <h3 className="text-xl font-medium">Assignment Submitted</h3>
                  <p className="text-green-600">Your assignment has been submitted successfully.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AssignmentDetail;
