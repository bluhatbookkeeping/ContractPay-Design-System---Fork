import { BadgeStatus } from '../components/Badges';
import { ReceiptCategory } from '../components/ReceiptComponents';

export interface User {
  id: string;
  name: string;
  role: 'contractor' | 'homeowner';
  company?: string;
  avatar?: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Milestone {
  id: string;
  name: string;
  amount: number;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

export interface Project {
  id: string;
  address: string;
  homeownerName: string;
  contractorName: string;
  status: BadgeStatus;
  contractAmount: number;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  milestones: Milestone[];
  escrow: {
    total: number;
    available: number;
    holdback: number;
    disputed: number;
  };
  // Added terms for dynamic contract clauses
  terms?: {title: string;content: string;}[];
}

export interface DrawRequest {
  id: string;
  projectId: string;
  milestoneId: string;
  milestoneName: string;
  amount: number;
  status: BadgeStatus;
  dateSubmitted: string;
  photos: string[];
  description: string;
  hoursRemaining?: number;
}

export interface Message {
  id: string;
  projectId: string;
  content: string;
  senderType: 'contractor' | 'homeowner' | 'system';
  timestamp: string;
  isRead: boolean;
  attachments?: {type: 'image' | 'file';url: string;name: string;}[];
}

export interface Receipt {
  id: string;
  projectId: string;
  thumbnailUrl: string;
  vendor: string;
  amount: number;
  category: ReceiptCategory;
  date: string;
  isShared: boolean;
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  authorName: string;
  authorLocation: string;
  date: string;
  photos?: string[];
}

// Mock Users
export const currentUserContractor: User = {
  id: 'c1',
  name: 'John Builder',
  role: 'contractor',
  company: 'ABC Construction',
  email: 'john@abcconst.com',
  phone: '(555) 123-4567',
  avatar:
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'
};

export const currentUserHomeowner: User = {
  id: 'h1',
  name: 'Sarah Jenkins',
  role: 'homeowner',
  email: 'sarah.j@example.com',
  phone: '(555) 987-6543',
  address: '847 Oak Street, San Diego CA',
  avatar:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
};

// Mock Projects
export const projects: Project[] = [
{
  id: 'p1',
  address: '847 Oak Street',
  homeownerName: 'Sarah & Mike Jenkins',
  contractorName: 'ABC Construction',
  status: 'active',
  contractAmount: 85000,
  progress: 45,
  startDate: 'Jan 10, 2025',
  estimatedCompletion: 'Apr 15, 2025',
  milestones: [
  {
    id: 'm1',
    name: 'Demolition',
    amount: 8000,
    status: 'completed',
    description:
    'Full demo of existing cabinets, countertops, flooring, and drywall. Haul-away of all debris included.'
  },
  {
    id: 'm2',
    name: 'Rough Plumbing',
    amount: 12000,
    status: 'completed',
    description:
    'Relocate supply and drain lines per approved layout. Includes new shut-offs and pressure test.'
  },
  {
    id: 'm3',
    name: 'Rough Electrical',
    amount: 10000,
    status: 'completed',
    description:
    'New 20-amp circuits for appliances, under-cabinet lighting rough-in, and GFCI outlets per code.'
  },
  {
    id: 'm4',
    name: 'Cabinets & Counters',
    amount: 25000,
    status: 'current',
    description:
    'Installation of all base and upper cabinets per approved layout. Quartz countertop fabrication and install. Hardware included.'
  },
  {
    id: 'm5',
    name: 'Appliances',
    amount: 15000,
    status: 'upcoming',
    description:
    'Installation of refrigerator, dishwasher, range, range hood, and microwave. Appliances supplied by homeowner unless noted otherwise.'
  },
  {
    id: 'm6',
    name: 'Final Trim',
    amount: 15000,
    status: 'upcoming',
    description:
    'Backsplash tile, paint, trim carpentry, fixture connections, punch-list walkthrough, and final clean.'
  }],

  escrow: {
    total: 85000,
    available: 47000,
    holdback: 8500,
    disputed: 0
  }
},
{
  id: 'p2',
  address: '1204 Maple Ave',
  homeownerName: 'David Chen',
  contractorName: 'ABC Construction',
  status: 'active',
  contractAmount: 45000,
  progress: 30,
  startDate: 'Feb 01, 2025',
  estimatedCompletion: 'Mar 30, 2025',
  milestones: [],
  escrow: { total: 45000, available: 30000, holdback: 4500, disputed: 0 }
},
{
  id: 'p3',
  address: '332 Pine Lane',
  homeownerName: 'Emily Wilson',
  contractorName: 'ABC Construction',
  status: 'sent',
  contractAmount: 120000,
  progress: 0,
  startDate: 'TBD',
  estimatedCompletion: 'TBD',
  milestones: [],
  escrow: { total: 0, available: 0, holdback: 0, disputed: 0 }
}];


// Mock Draws
export const draws: DrawRequest[] = [
{
  id: 'd1',
  projectId: 'p1',
  milestoneId: 'm4',
  milestoneName: 'Cabinets & Counters',
  amount: 25000,
  status: 'pending',
  dateSubmitted: 'Today',
  photos: [
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1556909190-eccf4c8ba7ef?auto=format&fit=crop&w=200&q=80'],

  description:
  'Installed all base and upper cabinets in kitchen. Countertops have been leveled and secured. Hardware installation is 50% complete.',
  hoursRemaining: 36
},
{
  id: 'd2',
  projectId: 'p1',
  milestoneId: 'm3',
  milestoneName: 'Rough Electrical',
  amount: 10000,
  status: 'approved',
  dateSubmitted: 'Feb 15, 2025',
  photos: [],
  description: 'All rough electrical work completed and inspected.'
}];


// Mock Messages
export const messages: Message[] = [
{
  id: 'msg1',
  projectId: 'p1',
  content: 'Hi John, when do you think the cabinets will be finished?',
  senderType: 'homeowner',
  timestamp: 'Yesterday 2:30 PM',
  isRead: true
},
{
  id: 'msg2',
  projectId: 'p1',
  content:
  'Hi Sarah, we are aiming to have them done by tomorrow afternoon. The countertops just arrived.',
  senderType: 'contractor',
  timestamp: 'Yesterday 2:45 PM',
  isRead: true
},
{
  id: 'msg3',
  projectId: 'p1',
  content: "That sounds great! Can't wait to see them.",
  senderType: 'homeowner',
  timestamp: 'Yesterday 3:00 PM',
  isRead: true
},
{
  id: 'msg4',
  projectId: 'p1',
  content: 'Draw request submitted for Cabinets & Counters.',
  senderType: 'system',
  timestamp: 'Today 9:00 AM',
  isRead: true
},
{
  id: 'msg5',
  projectId: 'p1',
  content:
  "I've uploaded some photos of the progress. Please take a look when you have a moment.",
  senderType: 'contractor',
  timestamp: 'Today 9:05 AM',
  isRead: true
}];


// Mock Receipts
export const receipts: Receipt[] = [
{
  id: 'r1',
  projectId: 'p1',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'Home Depot',
  amount: 245.5,
  category: 'materials',
  date: 'Feb 20, 2025',
  isShared: true
},
{
  id: 'r2',
  projectId: 'p1',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'Sunbelt Rentals',
  amount: 1200.0,
  category: 'equipment',
  date: 'Feb 18, 2025',
  isShared: false
},
{
  id: 'r3',
  projectId: 'p1',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'Ferguson Plumbing',
  amount: 3450.0,
  category: 'materials',
  date: 'Feb 10, 2025',
  isShared: true
}];


// Mock Reviews
export const reviews: Review[] = [
{
  id: 'rev1',
  rating: 5,
  content:
  'ABC Construction did an amazing job on our kitchen remodel. They were on time, on budget, and the quality of work was outstanding. Highly recommended!',
  authorName: 'Sarah Jenkins',
  authorLocation: 'San Diego, CA',
  date: 'Feb 10, 2025',
  photos: [
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80']

},
{
  id: 'rev2',
  rating: 5,
  content:
  'Professional, clean, and communicative. John made the whole process easy.',
  authorName: 'Mark Thompson',
  authorLocation: 'La Jolla, CA',
  date: 'Jan 15, 2025'
},
{
  id: 'rev3',
  rating: 4,
  content:
  'Great work overall, just a slight delay on materials but they handled it well.',
  authorName: 'Lisa Rodriguez',
  authorLocation: 'Del Mar, CA',
  date: 'Dec 05, 2024'
}];