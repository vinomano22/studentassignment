
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Assignment, fetchAssignments } from '@/lib/data';
import AssignmentList from '@/components/AssignmentList';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAssignments();
        setAssignments(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load assignments',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignments();
  }, [toast]);
  
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-medium mb-4">Student Assignment Portal</h1>
              <p className="text-muted-foreground">
                Manage and submit your assignments with ease. Stay organized and never miss a deadline.
              </p>
            </div>
          </motion.div>
          
          {!isLoading && <Dashboard assignments={assignments} />}
          
          <AssignmentList 
            assignments={assignments} 
            isLoading={isLoading} 
          />
        </div>
      </motion.div>
    </>
  );
};

export default Index;
