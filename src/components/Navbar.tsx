
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BookOpen, FileText, Calendar, User } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80",
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-medium text-lg">Assignment Hub</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium text-slate-700 hover:text-primary transition-colors",
              isActive('/') && "text-primary"
            )}
          >
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1.5" />
              Assignments
            </span>
          </Link>
          <Link 
            to="/submissions" 
            className={cn(
              "text-sm font-medium text-slate-700 hover:text-primary transition-colors",
              isActive('/submissions') && "text-primary"
            )}
          >
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1.5" />
              Submissions
            </span>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium hidden md:inline-block">vinoth KM</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="text-sm font-medium">VK</span>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200/80 z-50">
        <div className="flex justify-around py-2">
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center p-2 text-xs font-medium text-slate-700",
              isActive('/') && "text-primary"
            )}
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span>Assignments</span>
          </Link>
          <Link 
            to="/submissions" 
            className={cn(
              "flex flex-col items-center p-2 text-xs font-medium text-slate-700",
              isActive('/submissions') && "text-primary"
            )}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span>Submissions</span>
          </Link>
          <Link 
            to="/" 
            className="flex flex-col items-center p-2 text-xs font-medium text-slate-700"
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span>Calendar</span>
          </Link>
          <Link 
            to="/" 
            className="flex flex-col items-center p-2 text-xs font-medium text-slate-700"
          >
            <User className="h-5 w-5 mb-1" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
