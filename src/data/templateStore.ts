// Shared module-level store for contract clauses and templates

export interface Clause {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  category: 'warranty' | 'payment' | 'access' | 'delay' | 'dispute' | 'general';
}

export interface FullTemplate {
  id: string;
  name: string;
  type: 'full';
  description: string;
  scope: string;
  contractValue: string;
  projectType: string;
  usedCount: number;
  lastUsed: string;
  avgValue: string;
  milestoneCount: number;
  tags: string[];
  milestones: {name: string;amount: string;description?: string;}[];
  clauseIds: string[];
  useCount?: number;
}

// Default clause data
const _defaultClauseData: Clause[] = [
{
  id: 'c1',
  name: '1-Year Workmanship Warranty',
  content:
  'Contractor warrants that all work performed under this agreement will be free from defects in materials and workmanship for a period of one (1) year from the date of final completion. Contractor shall promptly remedy any defects covered by this warranty at no additional cost to the homeowner.',
  isDefault: true,
  category: 'warranty'
},
{
  id: 'c2',
  name: 'Change Order Policy',
  content:
  'Any changes to the scope of work, materials, or contract price must be agreed upon in writing via a signed Change Order before work begins. Verbal agreements or informal communications shall not constitute a binding change to this contract. Change Orders may affect the project timeline and total contract value.',
  isDefault: true,
  category: 'payment'
},
{
  id: 'c3',
  name: 'Escrow Payment Protection',
  content:
  'All payments under this contract are processed through ContractPay escrow. Funds are held securely and released only upon homeowner approval of each completed milestone. The homeowner has 48 hours to review and approve each draw request before automatic release.',
  isDefault: true,
  category: 'payment'
},
{
  id: 'c4',
  name: 'Site Access & Working Hours',
  content:
  'Homeowner agrees to provide contractor and subcontractors reasonable access to the property during normal working hours (7:00 AM – 6:00 PM, Monday through Saturday). Contractor will provide reasonable advance notice before accessing the property and will maintain a clean and safe work environment.',
  isDefault: false,
  category: 'access'
},
{
  id: 'c5',
  name: 'Weather & Force Majeure Delay',
  content:
  'Contractor shall not be liable for delays caused by circumstances beyond reasonable control, including but not limited to: severe weather conditions, natural disasters, supply chain disruptions, labor strikes, or government-mandated work stoppages. The project timeline will be extended by the duration of any such delay.',
  isDefault: false,
  category: 'delay'
},
{
  id: 'c6',
  name: 'Dispute Resolution',
  content:
  'Any dispute arising out of or relating to this contract shall first be submitted to ContractPay mediation. If mediation is unsuccessful, the dispute shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Funds held in escrow shall remain protected during any dispute resolution process.',
  isDefault: true,
  category: 'dispute'
},
{
  id: 'c7',
  name: 'Insurance & Licensing',
  content:
  "Contractor represents and warrants that it maintains general liability insurance (minimum $1,000,000 per occurrence) and workers' compensation insurance as required by law. Contractor holds all licenses required to perform the work described herein and will provide proof of insurance upon request.",
  isDefault: true,
  category: 'general'
},
{
  id: 'c8',
  name: 'Cleanup & Debris Removal',
  content:
  'Contractor shall maintain the work site in a reasonably clean condition throughout the project. Upon completion of all work, contractor shall remove all construction debris, excess materials, and equipment from the property. Final cleanup shall be completed within 3 business days of project completion.',
  isDefault: false,
  category: 'access'
}];


// Module-level mutable state
let _clauses: Clause[] = [..._defaultClauseData];

let _selectedClauseIds: string[] = _defaultClauseData.
filter((c) => c.isDefault).
map((c) => c.id);

let _selectedTemplate: FullTemplate | null = null;

// Named export for default clauses (used by ContractPage as fallback)
export const defaultClauses: Clause[] = _defaultClauseData;

// Full template definitions
export const fullTemplates: FullTemplate[] = [
{
  id: 't1',
  name: 'Kitchen Remodel — Standard',
  type: 'full',
  description:
  'Complete kitchen renovation including demo, rough-in, cabinets, countertops, appliances, and final trim.',
  scope:
  'Contractor agrees to perform a complete kitchen remodel at the location described above, including: demolition of existing cabinets, countertops, and flooring; installation of new custom cabinets per approved layout; supply and installation of quartz countertops; installation of hardwood or LVP flooring; updating electrical outlets and under-cabinet lighting to code; installation of new appliances (supplied by homeowner unless otherwise noted); painting of walls and ceiling in colors selected by homeowner.',
  contractValue: '82000',
  projectType: 'kitchen',
  usedCount: 8,
  useCount: 8,
  lastUsed: 'Feb 10, 2025',
  avgValue: '$82,000',
  milestoneCount: 6,
  tags: ['Kitchen', 'Remodel'],
  milestones: [
  {
    name: 'Deposit & Materials',
    amount: '16400',
    description:
    'Initial deposit to secure project start date and order all materials including cabinets, countertops, and flooring.'
  },
  {
    name: 'Demolition Complete',
    amount: '8200',
    description:
    'Full demo of existing cabinets, countertops, flooring, and drywall. All debris hauled away.'
  },
  {
    name: 'Rough-In Complete',
    amount: '16400',
    description:
    'Plumbing and electrical rough-in complete, inspected, and approved by local building department.'
  },
  {
    name: 'Cabinet Installation',
    amount: '20500',
    description:
    'All base and upper cabinets installed per approved layout. Quartz countertops fabricated and installed. Hardware included.'
  },
  {
    name: 'Appliances & Fixtures',
    amount: '12300',
    description:
    'Installation of refrigerator, dishwasher, range, range hood, and microwave. Plumbing fixtures connected and tested.'
  },
  {
    name: 'Final Completion',
    amount: '8200',
    description:
    'Backsplash tile, paint, trim carpentry, final inspections, punch-list walkthrough, and project close-out.'
  }],

  clauseIds: ['c1', 'c2', 'c3', 'c6', 'c7']
},
{
  id: 't2',
  name: 'Bathroom Renovation',
  type: 'full',
  description:
  'Full bathroom gut and remodel: tile, fixtures, vanity, plumbing, and electrical.',
  scope:
  'Contractor agrees to perform a complete bathroom renovation including: demolition of existing tile, fixtures, and vanity; installation of new tile flooring and shower/tub surround per approved design; supply and installation of new vanity, toilet, and fixtures; plumbing relocation as needed; installation of new exhaust fan and lighting; painting of walls and ceiling.',
  contractValue: '28000',
  projectType: 'bath',
  usedCount: 5,
  useCount: 5,
  lastUsed: 'Jan 22, 2025',
  avgValue: '$28,000',
  milestoneCount: 4,
  tags: ['Bathroom', 'Remodel'],
  milestones: [
  {
    name: 'Deposit',
    amount: '8400',
    description:
    'Initial deposit to secure scheduling and order tile, vanity, and fixtures.'
  },
  {
    name: 'Rough-In & Demo',
    amount: '7000',
    description:
    'Demo of existing tile, vanity, and fixtures. Plumbing and electrical rough-in complete and inspected.'
  },
  {
    name: 'Tile & Fixtures',
    amount: '8400',
    description:
    'Floor tile, shower/tub surround tile, vanity installation, toilet, and all plumbing fixtures set and tested.'
  },
  {
    name: 'Final Completion',
    amount: '4200',
    description:
    'Paint, trim, exhaust fan, lighting, mirrors, accessories, and final punch-list walkthrough.'
  }],

  clauseIds: ['c1', 'c2', 'c3', 'c6', 'c7', 'c8']
},
{
  id: 't3',
  name: 'Deck & Patio Build',
  type: 'full',
  description:
  'New deck construction with framing, decking, railings, stairs, and finishing.',
  scope:
  'Contractor agrees to construct a new deck/patio at the location described above, including: site preparation and footing installation; pressure-treated or composite framing per approved plans; installation of composite decking boards; installation of railings and balusters per code; construction of stairs with handrail; application of sealant or stain as selected by homeowner.',
  contractValue: '18000',
  projectType: 'deck',
  usedCount: 3,
  useCount: 3,
  lastUsed: 'Dec 15, 2024',
  avgValue: '$18,000',
  milestoneCount: 3,
  tags: ['Exterior', 'New Build'],
  milestones: [
  {
    name: 'Deposit & Materials',
    amount: '5400',
    description:
    'Deposit to secure start date and order composite decking, framing lumber, hardware, and concrete for footings.'
  },
  {
    name: 'Framing & Decking',
    amount: '8100',
    description:
    'Footing installation, pressure-treated framing, composite deck boards, railings, balusters, and stairs with handrail.'
  },
  {
    name: 'Final Completion',
    amount: '4500',
    description:
    'Sealant or stain application, final inspection, permit close-out, and site cleanup.'
  }],

  clauseIds: ['c1', 'c2', 'c3', 'c5', 'c6', 'c7']
}];


// ── Clause CRUD ──────────────────────────────────────────────────────────────

export const getAllClauses = (): Clause[] => [..._clauses];

export const getSelectedClauseIds = (): string[] => [..._selectedClauseIds];

export const setSelectedClauseIds = (ids: string[]): void => {
  _selectedClauseIds = [...ids];
};

/** Returns full Clause objects for the currently selected IDs */
export const getSelectedClauses = (): Clause[] =>
_clauses.filter((c) => _selectedClauseIds.includes(c.id));

export const addClause = (clause: Omit<Clause, 'id'>): Clause => {
  const newClause: Clause = { ...clause, id: `c${Date.now()}` };
  _clauses = [..._clauses, newClause];
  return newClause;
};

export const updateClause = (id: string, updates: Partial<Clause>): void => {
  _clauses = _clauses.map((c) => c.id === id ? { ...c, ...updates } : c);
};

export const deleteClause = (id: string): void => {
  _clauses = _clauses.filter((c) => c.id !== id);
  _selectedClauseIds = _selectedClauseIds.filter((cid) => cid !== id);
};

export const toggleClauseDefault = (id: string): void => {
  _clauses = _clauses.map((c) =>
  c.id === id ? { ...c, isDefault: !c.isDefault } : c
  );
};

// ── Template selection (cross-page state) ────────────────────────────────────

export const setSelectedTemplate = (template: FullTemplate | null): void => {
  _selectedTemplate = template;
  if (template) {
    _selectedClauseIds = [...template.clauseIds];
  }
};

export const getSelectedTemplate = (): FullTemplate | null => _selectedTemplate;