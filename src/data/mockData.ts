import { AwardCategory, Staff, Nomination } from '@/types';

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    position: 'Lead Product Designer',
    department: 'Technology Department',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    position: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    position: 'Marketing Director',
    department: 'Marketing',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@example.com',
    position: 'Data Analyst',
    department: 'Business Intelligence',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    id: '5',
    name: 'Jessica Williams',
    email: 'jessica.williams@example.com',
    position: 'HR Manager',
    department: 'Human Resources',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
  },
  {
    id: '6',
    name: 'James Brown',
    email: 'james.brown@example.com',
    position: 'Sales Executive',
    department: 'Sales',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    id: '7',
    name: 'Olivia Garcia',
    email: 'olivia.garcia@example.com',
    position: 'Accountant',
    department: 'Finance',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
  {
    id: '8',
    name: 'Ethan Martinez',
    email: 'ethan.martinez@example.com',
    position: 'DevOps Engineer',
    department: 'Engineering',
    avatar:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
  },
  {
    id: '9',
    name: 'Sophia Anderson',
    email: 'sophia.anderson@example.com',
    position: 'UX Researcher',
    department: 'Technology Department',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
  },
  {
    id: '10',
    name: 'Daniel Thompson',
    email: 'daniel.thompson@example.com',
    position: 'Backend Developer',
    department: 'Engineering',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  },
  {
    id: '11',
    name: 'Isabella White',
    email: 'isabella.white@example.com',
    position: 'Content Marketing Manager',
    department: 'Marketing',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    id: '12',
    name: 'Ryan Johnson',
    email: 'ryan.johnson@example.com',
    position: 'Product Manager',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  },
  {
    id: '13',
    name: 'Ava Martinez',
    email: 'ava.martinez@example.com',
    position: 'Customer Support Lead',
    department: 'Customer Service',
    avatar:
      'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400',
  },
  {
    id: '14',
    name: 'William Davis',
    email: 'william.davis@example.com',
    position: 'Operations Manager',
    department: 'Operations',
    avatar:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  },
  {
    id: '15',
    name: 'Mia Robinson',
    email: 'mia.robinson@example.com',
    position: 'Quality Assurance Engineer',
    department: 'Engineering',
    avatar:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400',
  },
  {
    id: '16',
    name: 'Alexander Wilson',
    email: 'alexander.wilson@example.com',
    position: 'Security Specialist',
    department: 'IT Security',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  },
  {
    id: '17',
    name: 'Charlotte Moore',
    email: 'charlotte.moore@example.com',
    position: 'Business Analyst',
    department: 'Business Intelligence',
    avatar:
      'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=400',
  },
  {
    id: '18',
    name: 'Benjamin Taylor',
    email: 'benjamin.taylor@example.com',
    position: 'Sales Manager',
    department: 'Sales',
    avatar:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
  },
  {
    id: '19',
    name: 'Amelia Harris',
    email: 'amelia.harris@example.com',
    position: 'Financial Controller',
    department: 'Finance',
    avatar:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
  },
  {
    id: '20',
    name: 'Lucas Clark',
    email: 'lucas.clark@example.com',
    position: 'Mobile Developer',
    department: 'Engineering',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
  },
];

export const mockCategories: AwardCategory[] = [
  {
    id: '1',
    title: 'Innovator of the Year',
    description:
      'Recognizing groundbreaking ideas and solutions that drive our company forward.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    type: 'Individual Award',
    nominationDeadline: '25 Dec',
    status: 'published',
  },
  {
    id: '2',
    title: 'Team Player Award',
    description:
      'Celebrating exceptional collaboration, support, and dedication to team success.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    type: 'Team Award',
    nominationDeadline: '25 Dec',
    status: 'published',
  },
  {
    id: '3',
    title: 'Customer Service Champion',
    description:
      'For excellence in client relations and consistently exceeding customer expectations.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
    type: 'Individual Award',
    department: 'Sales Dept',
    nominationDeadline: '28 Dec',
    status: 'published',
  },
  {
    id: '4',
    title: 'Leadership Excellence',
    description:
      'Awarding outstanding management, mentorship, and inspirational leadership.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    type: 'Individual Award',
    nominationDeadline: '30 Dec',
    status: 'published',
  },
  {
    id: '5',
    title: 'Rising Star Award',
    description:
      'Recognizing outstanding new talent showing exceptional promise and growth.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    type: 'Individual Award',
    nominationDeadline: '27 Dec',
    status: 'published',
  },
  {
    id: '6',
    title: 'Excellence in Technology',
    description:
      'For technical expertise and contributions to our technological advancement.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    type: 'Individual Award',
    department: 'Technology Department',
    nominationDeadline: '29 Dec',
    status: 'published',
  },
  {
    id: '7',
    title: 'Marketing Maven',
    description:
      'Celebrating creative campaigns and impactful marketing strategies.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    type: 'Individual Award',
    department: 'Marketing',
    nominationDeadline: '26 Dec',
    status: 'published',
  },
  {
    id: '8',
    title: 'Culture Champion',
    description:
      'For promoting company values and fostering a positive workplace environment.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    type: 'Team Award',
    nominationDeadline: '31 Dec',
    status: 'published',
  },
  {
    id: '9',
    title: 'Problem Solver Award',
    description:
      'Recognizing creative solutions to complex challenges and critical thinking.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    type: 'Individual Award',
    nominationDeadline: '27 Dec',
    status: 'published',
  },
  {
    id: '10',
    title: 'Mentor of the Year',
    description:
      'For exceptional guidance, coaching, and helping others grow professionally.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    type: 'Individual Award',
    nominationDeadline: '28 Dec',
    status: 'published',
  },
];

export const mockNominations: Nomination[] = [
  {
    id: '1',
    nomineeId: '1',
    nominee: mockStaff[0],
    nominatorId: '2',
    nominator: mockStaff[1],
    categoryId: '1',
    category: mockCategories[0],
    reason:
      'Sarah has consistently delivered innovative design solutions that have significantly improved our user experience. Her creative approach to problem-solving has set new standards for our design team.',
    submittedAt: '2025-12-01T10:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    nomineeId: '6',
    nominee: mockStaff[5],
    nominatorId: '3',
    nominator: mockStaff[2],
    categoryId: '4',
    category: mockCategories[3],
    reason:
      'James has shown exceptional leadership in driving our sales team to exceed targets consistently. His mentorship has helped junior team members grow significantly.',
    submittedAt: '2025-11-28T14:20:00Z',
    status: 'approved',
  },
  {
    id: '3',
    nomineeId: '3',
    nominee: mockStaff[2],
    nominatorId: '11',
    nominator: mockStaff[10],
    categoryId: '7',
    category: mockCategories[6],
    reason:
      'Emily has led multiple successful marketing campaigns that have increased our brand visibility by 150%. Her strategic thinking is outstanding.',
    submittedAt: '2025-12-02T09:15:00Z',
    status: 'approved',
  },
  {
    id: '4',
    nomineeId: '2',
    nominee: mockStaff[1],
    nominatorId: '10',
    nominator: mockStaff[9],
    categoryId: '6',
    category: mockCategories[5],
    reason:
      'Michael has been instrumental in modernizing our tech stack. His contributions to our frontend architecture have improved performance dramatically.',
    submittedAt: '2025-11-30T16:45:00Z',
    status: 'shortlisted',
  },
  {
    id: '5',
    nomineeId: '13',
    nominee: mockStaff[12],
    nominatorId: '5',
    nominator: mockStaff[4],
    categoryId: '3',
    category: mockCategories[2],
    reason:
      'Ava consistently goes above and beyond in supporting our customers. Her response time and problem resolution rate are exceptional.',
    submittedAt: '2025-12-03T11:20:00Z',
    status: 'pending',
  },
  {
    id: '6',
    nomineeId: '12',
    nominee: mockStaff[11],
    nominatorId: '1',
    nominator: mockStaff[0],
    categoryId: '9',
    category: mockCategories[8],
    reason:
      'Ryan has an incredible ability to break down complex problems into manageable solutions. His analytical skills have saved us countless hours.',
    submittedAt: '2025-11-29T13:30:00Z',
    status: 'approved',
  },
  {
    id: '7',
    nomineeId: '15',
    nominee: mockStaff[14],
    nominatorId: '2',
    nominator: mockStaff[1],
    categoryId: '2',
    category: mockCategories[1],
    reason:
      'Mia is always willing to help team members and shares her knowledge generously. She embodies what it means to be a team player.',
    submittedAt: '2025-12-01T15:10:00Z',
    status: 'pending',
  },
  {
    id: '8',
    nomineeId: '20',
    nominee: mockStaff[19],
    nominatorId: '9',
    nominator: mockStaff[8],
    categoryId: '5',
    category: mockCategories[4],
    reason:
      'Lucas joined us just a year ago and has already made significant contributions to our mobile development efforts. His potential is unlimited.',
    submittedAt: '2025-12-04T08:50:00Z',
    status: 'shortlisted',
  },
  {
    id: '9',
    nomineeId: '5',
    nominee: mockStaff[4],
    nominatorId: '14',
    nominator: mockStaff[13],
    categoryId: '10',
    category: mockCategories[9],
    reason:
      'Jessica has mentored over 10 new hires this year, helping them integrate smoothly into our company culture. Her guidance has been invaluable.',
    submittedAt: '2025-11-27T10:00:00Z',
    status: 'approved',
  },
  {
    id: '10',
    nomineeId: '8',
    nominee: mockStaff[7],
    nominatorId: '16',
    nominator: mockStaff[15],
    categoryId: '6',
    category: mockCategories[5],
    reason:
      'Ethan has automated many of our deployment processes, reducing deployment time by 70%. His DevOps expertise is world-class.',
    submittedAt: '2025-12-02T14:25:00Z',
    status: 'pending',
  },
  {
    id: '11',
    nomineeId: '14',
    nominee: mockStaff[13],
    nominatorId: '19',
    nominator: mockStaff[18],
    categoryId: '4',
    category: mockCategories[3],
    reason:
      'William has transformed our operations department through process improvements that have increased efficiency by 40%.',
    submittedAt: '2025-12-01T12:40:00Z',
    status: 'rejected',
  },
  {
    id: '12',
    nomineeId: '11',
    nominee: mockStaff[10],
    nominatorId: '3',
    nominator: mockStaff[2],
    categoryId: '7',
    category: mockCategories[6],
    reason:
      'Isabella creates compelling content that resonates with our audience. Her blog posts have increased engagement by 200%.',
    submittedAt: '2025-11-26T09:30:00Z',
    status: 'approved',
  },
];
