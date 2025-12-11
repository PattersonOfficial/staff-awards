export interface AwardCategory {
  id: string;
  title: string;
  description: string;
  image: string | null;
  type: string;
  department?: string | null;
  nominationDeadline: string;
  status: 'draft' | 'published' | 'closed';
  shortlistingStart?: string | null;
  shortlistingEnd?: string | null;
  votingStart?: string | null;
  votingEnd?: string | null;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar: string | null;
}

export interface Nomination {
  id: string;
  nomineeId: string;
  nominee: Staff;
  nominatorId?: string; // Legacy - may not exist
  nominator?: Staff; // Optional - may not have staff record
  nominatorEmail?: string; // Display email from Auth user
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
  winnerId?: string | null; // Official winner ID when published
}

export type UserRole = 'staff' | 'admin';
