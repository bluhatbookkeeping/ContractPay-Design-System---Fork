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
  status: 'completed' | 'current' | 'upcoming' | 'disputed';
  description?: string;
}

export interface Project {
  id: string;
  address: string;
  homeownerName: string;
  homeownerEmail?: string;
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
  type?: 'milestone' | 'change-order';
  changeOrderId?: string;
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

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
  dateApproved?: string;
  impactDays: number;
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
  homeownerEmail: 'sarah.j@example.com',
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
    status: 'disputed',
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
    available: 35000,
    holdback: 8500,
    disputed: 12000
  }
},
{
  id: 'p2',
  address: '1204 Maple Ave',
  homeownerName: 'David Chen',
  homeownerEmail: 'david.chen@example.com',
  contractorName: 'ABC Construction',
  status: 'active',
  contractAmount: 45000,
  progress: 30,
  startDate: 'Feb 01, 2025',
  estimatedCompletion: 'Mar 30, 2025',
  milestones: [
  {
    id: 'p2m1',
    name: 'Demo & Site Prep',
    amount: 6000,
    status: 'completed',
    description:
    'Full demolition of existing bathroom tile, vanity, and fixtures. Debris removal and subfloor inspection.'
  },
  {
    id: 'p2m2',
    name: 'Rough Plumbing',
    amount: 8500,
    status: 'completed',
    description:
    'Relocate shower drain and supply lines. Install new shut-off valves and pressure test.'
  },
  {
    id: 'p2m3',
    name: 'Tile & Waterproofing',
    amount: 12000,
    status: 'current',
    description:
    'Schluter waterproofing membrane, floor tile, and full shower surround tile per approved design.'
  },
  {
    id: 'p2m4',
    name: 'Vanity & Fixtures',
    amount: 10500,
    status: 'upcoming',
    description:
    'Install new floating vanity, toilet, shower fixtures, mirrors, and accessories.'
  },
  {
    id: 'p2m5',
    name: 'Final Punch & Paint',
    amount: 8000,
    status: 'upcoming',
    description:
    'Paint, trim, exhaust fan, lighting, final inspection, and punch-list walkthrough.'
  }],

  escrow: { total: 45000, available: 30000, holdback: 4500, disputed: 0 }
},
{
  id: 'p3',
  address: '332 Pine Lane',
  homeownerName: 'Emily Wilson',
  homeownerEmail: 'emily.wilson@example.com',
  contractorName: 'ABC Construction',
  status: 'sent',
  contractAmount: 120000,
  progress: 0,
  startDate: 'TBD',
  estimatedCompletion: 'TBD',
  milestones: [],
  escrow: { total: 0, available: 0, holdback: 0, disputed: 0 }
},
{
  id: 'p4',
  address: '510 Birch Court',
  homeownerName: 'Rachel & Tom Adams',
  homeownerEmail: 'rachel.adams@example.com',
  contractorName: 'ABC Construction',
  status: 'complete',
  contractAmount: 62000,
  progress: 100,
  startDate: 'Sep 15, 2024',
  estimatedCompletion: 'Dec 20, 2024',
  milestones: [
  {
    id: 'p4m1',
    name: 'Demolition & Framing',
    amount: 10000,
    status: 'completed',
    description:
    'Remove existing deck structure and frame new covered patio with engineered beams.'
  },
  {
    id: 'p4m2',
    name: 'Electrical & Plumbing',
    amount: 12000,
    status: 'completed',
    description:
    'Outdoor electrical for lighting and outlets. Plumbing for outdoor kitchen sink and gas line.'
  },
  {
    id: 'p4m3',
    name: 'Roofing & Siding',
    amount: 15000,
    status: 'completed',
    description:
    'Patio roof with matching shingles. Cedar siding on support columns.'
  },
  {
    id: 'p4m4',
    name: 'Outdoor Kitchen Install',
    amount: 18000,
    status: 'completed',
    description:
    'Built-in grill, countertops, cabinetry, and sink installation.'
  },
  {
    id: 'p4m5',
    name: 'Final Landscaping & Cleanup',
    amount: 7000,
    status: 'completed',
    description:
    'Pavers, lighting, landscaping around patio, and final walkthrough.'
  }],

  escrow: { total: 62000, available: 0, holdback: 0, disputed: 0 }
},
{
  id: 'p5',
  address: '2100 Sunset Blvd',
  homeownerName: 'Karen & James Park',
  homeownerEmail: 'karen.park@example.com',
  contractorName: 'ABC Construction',
  status: 'active',
  contractAmount: 210000,
  progress: 33,
  startDate: 'Nov 01, 2024',
  estimatedCompletion: 'Jun 30, 2025',
  milestones: [
  {
    id: 'p5m1',
    name: 'Permits & Planning',
    amount: 5000,
    status: 'completed',
    description:
    'All city permits pulled and architectural plans finalized.'
  },
  {
    id: 'p5m2',
    name: 'Demolition',
    amount: 12000,
    status: 'completed',
    description:
    'Full interior demo of kitchen, two bathrooms, and living areas.'
  },
  {
    id: 'p5m3',
    name: 'Structural Work',
    amount: 25000,
    status: 'completed',
    description:
    'Load-bearing wall removal with steel beam install. New header for expanded kitchen opening.'
  },
  {
    id: 'p5m4',
    name: 'HVAC Rough-In',
    amount: 18000,
    status: 'completed',
    description:
    'New ductwork layout, mini-split installation, and zone controls.'
  },
  {
    id: 'p5m5',
    name: 'Plumbing Rough',
    amount: 16000,
    status: 'current',
    description:
    'Relocate all supply and drain lines for new kitchen and bath layouts. Gas line for range.'
  },
  {
    id: 'p5m6',
    name: 'Electrical Rough',
    amount: 14000,
    status: 'upcoming',
    description:
    'New 200-amp panel, circuits for kitchen appliances, bathroom fans, and whole-home lighting plan.'
  },
  {
    id: 'p5m7',
    name: 'Insulation & Drywall',
    amount: 20000,
    status: 'upcoming',
    description:
    'Spray foam insulation in exterior walls. Hang, tape, and finish all drywall.'
  },
  {
    id: 'p5m8',
    name: 'Flooring',
    amount: 22000,
    status: 'upcoming',
    description:
    'Engineered hardwood throughout main level. Tile in bathrooms and laundry.'
  },
  {
    id: 'p5m9',
    name: 'Cabinets & Counters',
    amount: 30000,
    status: 'upcoming',
    description:
    'Custom kitchen cabinets, bathroom vanities, and quartz countertops throughout.'
  },
  {
    id: 'p5m10',
    name: 'Painting',
    amount: 12000,
    status: 'upcoming',
    description:
    'Interior paint — walls, ceilings, trim, and doors. Two coats throughout.'
  },
  {
    id: 'p5m11',
    name: 'Fixtures & Trim',
    amount: 20000,
    status: 'upcoming',
    description:
    'All light fixtures, plumbing fixtures, hardware, baseboards, and crown molding.'
  },
  {
    id: 'p5m12',
    name: 'Final Inspection & Punch',
    amount: 16000,
    status: 'upcoming',
    description:
    'City final inspection, punch-list walkthrough, and project closeout.'
  }],

  escrow: { total: 210000, available: 134000, holdback: 21000, disputed: 0 }
}];


// Mock Draws
export const draws: DrawRequest[] = [
{
  id: 'd0',
  projectId: 'p1',
  milestoneId: 'm1',
  milestoneName: 'Demolition',
  amount: 8000,
  status: 'approved',
  dateSubmitted: 'Jan 18, 2025',
  type: 'milestone',
  photos: [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?auto=format&fit=crop&w=200&q=80'],

  description:
  'Full demolition of existing cabinets, countertops, flooring, and drywall completed. All debris hauled off-site. Subfloor inspected and confirmed structurally sound. Site prepped and ready for rough plumbing.'
},
{
  id: 'd1',
  projectId: 'p1',
  milestoneId: 'm4',
  milestoneName: 'Cabinets & Counters',
  amount: 25000,
  status: 'pending',
  dateSubmitted: 'Today',
  type: 'milestone',
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
  type: 'milestone',
  photos: [],
  description: 'All rough electrical work completed and inspected.'
},
{
  id: 'd5',
  projectId: 'p1',
  milestoneId: 'm2',
  milestoneName: 'Rough Plumbing',
  amount: 12000,
  status: 'disputed' as any,
  dateSubmitted: 'Feb 10, 2025',
  type: 'milestone',
  photos: [
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=200&q=80'],

  description:
  'Relocated supply and drain lines per approved layout. New shut-offs installed and pressure tested.'
},
{
  id: 'dco1',
  projectId: 'p1',
  milestoneId: 'co-1',
  milestoneName: 'CO-1: Upgrade Kitchen Faucet',
  amount: 450,
  status: 'pending',
  dateSubmitted: 'Feb 18, 2025',
  type: 'change-order',
  changeOrderId: 'co-1',
  photos: [
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=200&q=80'],

  description:
  'Matte black touchless faucet installed per approved change order CO-1. Replaces original chrome model specified in base contract. Installation complete and tested.',
  hoursRemaining: 48
},
{
  id: 'd3',
  projectId: 'p2',
  milestoneId: 'p2m3',
  milestoneName: 'Tile & Waterproofing',
  amount: 12000,
  status: 'pending',
  dateSubmitted: 'Today',
  type: 'milestone',
  photos: [
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1620626011761-996317702519?auto=format&fit=crop&w=200&q=80'],

  description:
  'Waterproofing membrane fully installed and cured. Floor tile set and grouted. Shower surround tile 80% complete — remaining two walls in progress.',
  hoursRemaining: 22
},
{
  id: 'd4',
  projectId: 'p2',
  milestoneId: 'p2m2',
  milestoneName: 'Rough Plumbing',
  amount: 8500,
  status: 'approved',
  dateSubmitted: 'Feb 08, 2025',
  type: 'milestone',
  photos: [],
  description:
  'All rough plumbing relocated and inspected. Passed city inspection on Feb 9.'
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
},
{
  id: 'msg6',
  projectId: 'p2',
  content:
  'Hi David, just wanted to confirm the tile selection for the bathroom.',
  senderType: 'contractor',
  timestamp: 'Yesterday 10:00 AM',
  isRead: true
},
{
  id: 'msg7',
  projectId: 'p2',
  content: 'Yes, we decided on the white subway tile with gray grout.',
  senderType: 'homeowner',
  timestamp: 'Yesterday 10:15 AM',
  isRead: false
},
{
  id: 'msg8',
  projectId: 'p2',
  content: 'Great, thanks! We will pick that up tomorrow.',
  senderType: 'contractor',
  timestamp: 'Yesterday 10:20 AM',
  isRead: true
},
{
  id: 'msg9',
  projectId: 'p2',
  content: 'Also, can we schedule a walkthrough for Friday?',
  senderType: 'homeowner',
  timestamp: 'Today 8:30 AM',
  isRead: false
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
},
{
  id: 'r4',
  projectId: 'p1',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'City of San Diego',
  amount: 875.0,
  category: 'permits',
  date: 'Jan 12, 2025',
  isShared: true
},
{
  id: 'r5',
  projectId: 'p2',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'Floor & Decor',
  amount: 2180.0,
  category: 'materials',
  date: 'Feb 22, 2025',
  isShared: true
},
{
  id: 'r6',
  projectId: 'p2',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'Schluter Systems',
  amount: 640.0,
  category: 'materials',
  date: 'Feb 15, 2025',
  isShared: false
},
{
  id: 'r7',
  projectId: 'p2',
  thumbnailUrl:
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80',
  vendor: 'ABC Tile Supply',
  amount: 1350.0,
  category: 'materials',
  date: 'Feb 12, 2025',
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


export const changeOrders: ChangeOrder[] = [
{
  id: 'co-1',
  projectId: 'p1',
  title: 'Upgrade Kitchen Faucet',
  description:
  'Client requested upgrade from standard chrome faucet to matte black touchless model.',
  amount: 450.0,
  status: 'approved',
  dateSubmitted: 'Jan 25, 2025',
  dateApproved: 'Jan 26, 2025',
  impactDays: 0
},
{
  id: 'co-2',
  projectId: 'p1',
  title: 'Additional Recessed Lighting',
  description:
  'Add 4 additional 6-inch recessed LED cans in the living room area.',
  amount: 1200.0,
  status: 'pending',
  dateSubmitted: 'Feb 02, 2025',
  impactDays: 1
},
{
  id: 'co-3',
  projectId: 'p1',
  title: 'Shower Niche Modification',
  description: 'Change shower niche size from 12x12 to 12x24 horizontal.',
  amount: 350.0,
  status: 'rejected',
  dateSubmitted: 'Jan 15, 2025',
  impactDays: 0
}];