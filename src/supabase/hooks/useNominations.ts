'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getNominations,
  getNominationById,
  getNominationsByCategory,
  getNominationsByUserUid,
  getPendingNominations,
  getShortlistedNominations,
  createNomination,
  approveNomination,
  rejectNomination,
  shortlistNomination,
  deleteNomination,
  getNominationCounts,
  type NominationWithDetails,
  type NominationInsert,
} from '../services/nominations';

export function useNominations() {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNominations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNominations();
      setNominations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch nominations')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  return { nominations, loading, error, refetch: fetchNominations };
}

export function useNomination(id: string | undefined) {
  const [nomination, setNomination] = useState<NominationWithDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchNomination = async () => {
      try {
        setLoading(true);
        const data = await getNominationById(id);
        setNomination(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch nomination')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNomination();
  }, [id]);

  return { nomination, loading, error };
}

export function useNominationsByCategory(categoryId: string | undefined) {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNominations = useCallback(async () => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getNominationsByCategory(categoryId);
      setNominations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch nominations')
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  return { nominations, loading, error, refetch: fetchNominations };
}

export function useMyNominations(userUid: string | undefined) {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNominations = useCallback(async () => {
    if (!userUid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getNominationsByUserUid(userUid);
      setNominations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch nominations')
      );
    } finally {
      setLoading(false);
    }
  }, [userUid]);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  return { nominations, loading, error, refetch: fetchNominations };
}

export function usePendingNominations() {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNominations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingNominations();
      setNominations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch nominations')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  return { nominations, loading, error, refetch: fetchNominations };
}

export function useShortlistedNominations(categoryId?: string) {
  const [nominations, setNominations] = useState<NominationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNominations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getShortlistedNominations(categoryId);
      setNominations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch nominations')
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  return { nominations, loading, error, refetch: fetchNominations };
}

export function useNominationCounts() {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    shortlisted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNominationCounts();
      setCounts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch counts')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return { counts, loading, error, refetch: fetchCounts };
}

export function useNominationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (nomination: NominationInsert) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createNomination(nomination);
      return data;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to create nomination');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await approveNomination(id);
      return data;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to approve nomination');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await rejectNomination(id);
      return data;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to reject nomination');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const shortlist = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await shortlistNomination(id);
      return data;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to shortlist nomination');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteNomination(id);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to delete nomination');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { create, approve, reject, shortlist, remove, loading, error };
}
