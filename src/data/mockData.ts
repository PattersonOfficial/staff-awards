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
      'Sarah has consistently delivered innovative design solutions that have significantly improved our user experience.',
    submittedAt: '2023-10-15T10:30:00Z',
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
      'James has shown exceptional leadership in driving our sales team to exceed targets consistently.',
    submittedAt: '2023-10-12T14:20:00Z',
    status: 'approved',
  },
];
