
import { format, addDays } from 'date-fns';

// Define types
export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  instructions: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Graded';
  points: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentEmail: string;
  submissionDate: string;
  comment: string;
  fileUrl?: string;
  fileName?: string;
}

// Generate mock assignments
const today = new Date();

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    course: 'Frontend Development',
    description: 'Learn the basics of React Hooks and how they can simplify your React components.',
    instructions: 'Create a simple counter application using useState and useEffect hooks. Your application should allow users to increment, decrement, and reset the counter. Include a side effect that updates the document title with the current count.',
    dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    status: 'Not Started',
    points: 100
  },
  {
    id: '2',
    title: 'Data Structures Implementation',
    course: 'Computer Science',
    description: 'Implement common data structures in JavaScript and analyze their performance.',
    instructions: 'Implement a Stack, Queue, and LinkedList class in JavaScript. Include methods for adding, removing, and accessing elements. Write brief documentation for each method and include time complexity analysis.',
    dueDate: format(addDays(today, 10), 'yyyy-MM-dd'),
    status: 'Not Started',
    points: 150
  },
  {
    id: '3',
    title: 'Database Schema Design',
    course: 'Backend Development',
    description: 'Design a database schema for a student management system.',
    instructions: 'Create an ERD (Entity Relationship Diagram) for a student management system. Your schema should include entities for Students, Courses, Instructors, and Enrollments. Include primary keys, foreign keys, and appropriate relationships between entities.',
    dueDate: format(addDays(today, 14), 'yyyy-MM-dd'),
    status: 'Not Started',
    points: 120
  },
  {
    id: '4',
    title: 'Responsive Web Design Project',
    course: 'UI/UX Design',
    description: 'Create a responsive website using modern CSS techniques.',
    instructions: 'Design and implement a responsive portfolio website. Your site should work well on mobile, tablet, and desktop devices. Use CSS Grid and/or Flexbox for layout. Include at least one media query to adjust the layout for different screen sizes.',
    dueDate: format(addDays(today, 21), 'yyyy-MM-dd'),
    status: 'Not Started',
    points: 200
  },
  {
    id: '5',
    title: 'API Integration Project',
    course: 'Frontend Development',
    description: 'Build a web application that integrates with a public API.',
    instructions: 'Create a web application that fetches and displays data from a public API of your choice. Implement proper error handling and loading states. Allow users to interact with the data (e.g., filtering, sorting, or searching).',
    dueDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    status: 'Not Started',
    points: 150
  },
  {
    id: '6',
    title: 'Algorithms: Sorting and Searching',
    course: 'Computer Science',
    description: 'Implement and analyze common sorting and searching algorithms.',
    instructions: 'Implement at least two sorting algorithms (e.g., Bubble Sort, Merge Sort) and two searching algorithms (e.g., Linear Search, Binary Search) in JavaScript. Write tests to verify your implementations and compare their performance with different input sizes.',
    dueDate: format(addDays(today, 12), 'yyyy-MM-dd'),
    status: 'Not Started',
    points: 180
  }
];

// Mock submissions
export const mockSubmissions: Submission[] = [];

// Simulated API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAssignments = async (): Promise<Assignment[]> => {
  await delay(800); // Simulate network delay
  return [...mockAssignments];
};

export const fetchAssignmentById = async (id: string): Promise<Assignment | undefined> => {
  await delay(600);
  return mockAssignments.find(assignment => assignment.id === id);
};

export const submitAssignment = async (submission: Omit<Submission, 'id' | 'submissionDate'>): Promise<Submission> => {
  await delay(1000);
  
  const newSubmission: Submission = {
    ...submission,
    id: Math.random().toString(36).substr(2, 9),
    submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };
  
  mockSubmissions.push(newSubmission);
  
  // Update assignment status
  const assignmentIndex = mockAssignments.findIndex(a => a.id === submission.assignmentId);
  if (assignmentIndex !== -1) {
    mockAssignments[assignmentIndex].status = 'Submitted';
  }
  
  return newSubmission;
};
