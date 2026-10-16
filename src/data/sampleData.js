export const STAGES = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
export const initialData = {
  theme: 'light',
  leads: [
    { id: '1', name: 'Acme Corp Inquiry', company: 'Acme Corp', email: 'contact@acme.demo', phone: '+1-555-1001', source: 'Website', priority: 'high', status: 'new', assignedTo: '1', value: 15000, notes: '', createdAt: '2025-10-10' },
    { id: '2', name: 'Beta Solutions Lead', company: 'Beta Solutions', email: 'sales@beta.demo', phone: '+1-555-1002', source: 'Referral', priority: 'medium', status: 'contacted', assignedTo: '2', value: 8000, notes: '', createdAt: '2025-10-12' },
    { id: '3', name: 'Gamma Industries', company: 'Gamma Industries', email: 'info@gamma.demo', phone: '+1-555-1003', source: 'LinkedIn', priority: 'high', status: 'qualified', assignedTo: '1', value: 25000, notes: '', createdAt: '2025-10-08' },
    { id: '4', name: 'Delta Retail', company: 'Delta Retail', email: 'proc@delta.demo', phone: '+1-555-1004', source: 'Cold Call', priority: 'low', status: 'new', assignedTo: '3', value: 5000, notes: '', createdAt: '2025-10-14' },
    { id: '5', name: 'Epsilon Tech', company: 'Epsilon Tech', email: 'hello@epsilon.demo', phone: '+1-555-1005', source: 'Trade Show', priority: 'medium', status: 'contacted', assignedTo: '2', value: 12000, notes: '', createdAt: '2025-10-11' },
  ],
  contacts: [
    { id: '1', name: 'Rachel Adams', email: 'rachel@acme.demo', phone: '+1-555-2001', companyId: '1', title: 'VP Sales', notes: '' },
    { id: '2', name: 'Marcus Lee', email: 'marcus@beta.demo', phone: '+1-555-2002', companyId: '2', title: 'CTO', notes: '' },
    { id: '3', name: 'Priya Shah', email: 'priya@gamma.demo', phone: '+1-555-2003', companyId: '3', title: 'Procurement Lead', notes: '' },
    { id: '4', name: 'Tom Brennan', email: 'tom@delta.demo', phone: '+1-555-2004', companyId: '4', title: 'Owner', notes: '' },
  ],
  companies: [
    { id: '1', name: 'Acme Corp', industry: 'Manufacturing', website: 'acme.demo', size: '201-500', location: 'Chicago, IL' },
    { id: '2', name: 'Beta Solutions', industry: 'Software', website: 'beta.demo', size: '51-200', location: 'Austin, TX' },
    { id: '3', name: 'Gamma Industries', industry: 'Energy', website: 'gamma.demo', size: '501-1000', location: 'Houston, TX' },
    { id: '4', name: 'Delta Retail', industry: 'Retail', website: 'delta.demo', size: '11-50', location: 'Portland, OR' },
    { id: '5', name: 'Epsilon Tech', industry: 'Technology', website: 'epsilon.demo', size: '51-200', location: 'San Jose, CA' },
  ],
  deals: [
    { id: '1', title: 'Acme Enterprise License', companyId: '1', contactId: '1', value: 45000, stage: 'Negotiation', probability: 70, ownerId: '1', closeDate: '2025-11-15', notes: '' },
    { id: '2', title: 'Beta Annual Contract', companyId: '2', contactId: '2', value: 18000, stage: 'Proposal', probability: 50, ownerId: '2', closeDate: '2025-11-30', notes: '' },
    { id: '3', title: 'Gamma Platform Deal', companyId: '3', contactId: '3', value: 72000, stage: 'Discovery', probability: 40, ownerId: '1', closeDate: '2025-12-20', notes: '' },
    { id: '4', title: 'Delta Starter Package', companyId: '4', contactId: '4', value: 6500, stage: 'Qualification', probability: 25, ownerId: '3', closeDate: '2025-11-10', notes: '' },
    { id: '5', title: 'Epsilon Pilot', companyId: '5', contactId: null, value: 12000, stage: 'Closed Won', probability: 100, ownerId: '2', closeDate: '2025-10-05', notes: '' },
    { id: '6', title: 'Old Prospect', companyId: '1', contactId: '1', value: 9000, stage: 'Closed Lost', probability: 0, ownerId: '3', closeDate: '2025-09-20', notes: '' },
  ],
  tasks: [
    { id: '1', title: 'Call Rachel about pricing', relatedTo: 'deal:1', dueDate: '2025-10-16', status: 'pending', priority: 'high', assignedTo: '1' },
    { id: '2', title: 'Send proposal to Beta', relatedTo: 'deal:2', dueDate: '2025-10-17', status: 'pending', priority: 'medium', assignedTo: '2' },
    { id: '3', title: 'Discovery call with Gamma', relatedTo: 'deal:3', dueDate: '2025-10-14', status: 'overdue', priority: 'high', assignedTo: '1' },
    { id: '4', title: 'Follow up Delta email', relatedTo: 'lead:4', dueDate: '2025-10-18', status: 'pending', priority: 'low', assignedTo: '3' },
    { id: '5', title: 'Update CRM notes', relatedTo: '', dueDate: '2025-10-15', status: 'completed', priority: 'low', assignedTo: '2' },
  ],
  team: [
    { id: '1', name: 'Alex Morgan', role: 'Sales Manager', email: 'alex@leadpilot.demo', target: 150000, closed: 72000 },
    { id: '2', name: 'Jordan Blake', role: 'Account Executive', email: 'jordan@leadpilot.demo', target: 100000, closed: 30000 },
    { id: '3', name: 'Casey Rivera', role: 'SDR', email: 'casey@leadpilot.demo', target: 50000, closed: 6500 },
  ],
}
