
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Assignment, submitAssignment } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { 
  UserIcon, 
  MailIcon, 
  UploadIcon, 
  FileTextIcon,
  CheckIcon,
  Loader2Icon
} from 'lucide-react';

interface SubmissionFormProps {
  assignment: Assignment;
  onSubmissionComplete: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ 
  assignment, 
  onSubmissionComplete 
}) => {
  const { toast } = useToast();
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, file: 'Please upload a PDF file' }));
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!studentName.trim()) {
      newErrors.studentName = 'Name is required';
    }
    
    if (!studentEmail.trim()) {
      newErrors.studentEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(studentEmail)) {
      newErrors.studentEmail = 'Email is invalid';
    }
    
    if (!file) {
      newErrors.file = 'Please upload your assignment';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitAssignment({
        assignmentId: assignment.id,
        studentName,
        studentEmail,
        comment,
        fileUrl: file ? URL.createObjectURL(file) : undefined,
        fileName: file?.name
      });
      
      toast({
        title: "Success!",
        description: "Your assignment has been submitted successfully.",
      });
      
      onSubmissionComplete();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 mt-8"
    >
      <h3 className="text-xl font-medium mb-6">Submit Your Assignment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errors.studentName) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.studentName;
                      return newErrors;
                    });
                  }
                }}
                className={`glass-input w-full px-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.studentName ? 'border-red-500 focus:ring-red-500/50' : ''
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.studentName && (
              <p className="mt-1.5 text-xs text-red-500">{errors.studentName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="studentEmail" className="block text-sm font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="studentEmail"
                type="email"
                value={studentEmail}
                onChange={(e) => {
                  setStudentEmail(e.target.value);
                  if (errors.studentEmail) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.studentEmail;
                      return newErrors;
                    });
                  }
                }}
                className={`glass-input w-full px-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.studentEmail ? 'border-red-500 focus:ring-red-500/50' : ''
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.studentEmail && (
              <p className="mt-1.5 text-xs text-red-500">{errors.studentEmail}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1.5">
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="glass-input w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              placeholder="Any additional comments about your submission"
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-1.5">
              Upload Assignment (PDF only)
            </label>
            <div className="relative">
              <label 
                htmlFor="file" 
                className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  file ? 'border-primary/30 bg-primary/5' : errors.file ? 'border-red-500/30 bg-red-500/5' : 'border-muted-foreground/30 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                {file ? (
                  <div className="flex items-center text-sm">
                    <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-slate-700 truncate max-w-xs">{file.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-sm text-muted-foreground py-4">
                    <UploadIcon className="h-8 w-8 mb-2" />
                    <span>Drag and drop your file here, or click to browse</span>
                    <span className="mt-1 text-xs">PDF only, max 5MB</span>
                  </div>
                )}
                <input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            {errors.file && (
              <p className="mt-1.5 text-xs text-red-500">{errors.file}</p>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium transition-all ${
              isSubmitting 
                ? 'bg-primary/70 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Submit Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SubmissionForm;
