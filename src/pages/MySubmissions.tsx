
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Assignment, Submission, fetchAssignments, mockSubmissions } from '@/lib/data';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { FileText, ExternalLink, CheckCircle, Calendar, Mail, User, FileIcon, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const MySubmissions: React.FC = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const assignmentsData = await fetchAssignments();
        
        // Create a map of assignment IDs to assignments
        const assignmentsMap = assignmentsData.reduce((acc, assignment) => {
          acc[assignment.id] = assignment;
          return acc;
        }, {} as Record<string, Assignment>);
        
        setAssignments(assignmentsMap);
        setSubmissions(mockSubmissions);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load submissions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const toggleSubmissionDetails = (submissionId: string) => {
    if (expandedSubmission === submissionId) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(submissionId);
    }
  };
  
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
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading submissions...</p>
        </div>
      </>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-medium mb-4">My Submissions</h1>
              <p className="text-muted-foreground">
                Track and manage all your submitted assignments.
              </p>
            </div>
          </motion.div>
          
          {submissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 text-center max-w-md mx-auto"
            >
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">No Submissions Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't submitted any assignments yet. Head over to the assignments page to get started.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                View Assignments
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={pageVariants}
              className="space-y-4"
            >
              {submissions.map((submission, index) => {
                const assignment = assignments[submission.assignmentId];
                
                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4 cursor-pointer" 
                         onClick={() => toggleSubmissionDetails(submission.id)}>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-700 font-medium">
                            Submitted
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-medium">
                          {assignment ? assignment.title : 'Unknown Assignment'}
                        </h3>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Submitted: {format(parseISO(submission.submissionDate), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0">
                        <button
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubmissionDetails(submission.id);
                          }}
                        >
                          {expandedSubmission === submission.id ? 'Hide Details' : 'View Details'}
                        </button>
                        <Link
                          to={`/assignment/${submission.assignmentId}`}
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-sm ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Assignment
                        </Link>
                      </div>
                    </div>
                    
                    {expandedSubmission === submission.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200/10"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Student Name</p>
                                <p className="text-sm text-muted-foreground">{submission.studentName}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-sm text-muted-foreground">{submission.studentEmail}</p>
                              </div>
                            </div>
                            
                            {submission.comment && (
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Comment</p>
                                  <p className="text-sm text-muted-foreground">{submission.comment}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {submission.fileName && (
                              <div className="flex items-start gap-2">
                                <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Submitted File</p>
                                  <div className="flex items-center">
                                    <p className="text-sm text-muted-foreground">{submission.fileName}</p>
                                    {submission.fileUrl && (
                                      <a 
                                        href={submission.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded hover:bg-primary/20 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        View PDF
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-2">
                              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Assignment Due Date</p>
                                <p className="text-sm text-muted-foreground">
                                  {assignment ? format(parseISO(assignment.dueDate), 'MMM d, yyyy') : 'Unknown'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-sm">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Submitted
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default MySubmissions;
