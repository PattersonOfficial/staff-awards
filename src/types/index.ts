export interface AwardCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'Individual Award' | 'Team Award';
  department?: string;
  nominationDeadline: string;
  status: 'draft' | 'published' | 'closed';
  shortlistingStart?: string;
  shortlistingEnd?: string;
  votingStart?: string;
  votingEnd?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar: string;
}

export interface Nomination {
  id: string;
  nomineeId: string;
  nominee: Staff;
  nominatorId: string;
  nominator: Staff;
  categoryId: string;
  category: AwardCategory;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
}

export interface Vote {
  id: string;
  voterId: string;
  voter: Staff;
  categoryId: string;
  nomineeId: string;
  votedAt: string;
}

export interface VotingResult {
  categoryId: string;
  category: AwardCategory;
  nominees: {
    nominee: Staff;
    voteCount: number;
    percentage: number;
  }[];
  totalVotes: number;
  status: 'ongoing' | 'completed';
}

export type UserRole = 'staff' | 'admin';
