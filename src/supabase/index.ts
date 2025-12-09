// Supabase client
export { supabase, createServerClient } from './client';

// Types
export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  Json,
} from './types';

// Services
export * from './services/auth';
export * from './services/categories';
export * from './services/nominations';
export * from './services/staff';
export * from './services/votes';

// Hooks
export { useAuth } from './hooks/useAuth';
export {
  useCategories,
  usePublishedCategories,
  useCategory,
  useCategoryMutations,
} from './hooks/useCategories';
export {
  useNominations,
  useNomination,
  useNominationsByCategory,
  useMyNominations,
  usePendingNominations,
  useShortlistedNominations,
  useNominationCounts,
  useNominationMutations,
} from './hooks/useNominations';
