'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategoryById, Category } from '@/supabase/services/categories';
import { getStaff, searchStaff, StaffMember } from '@/supabase/services/staff';
import { createNomination } from '@/supabase/services/nominations';

export default function NominationPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNominee, setSelectedNominee] = useState<StaffMember | null>(
    null
  );
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catData, staffData] = await Promise.all([
          getCategoryById(categoryId),
          getStaff(),
        ]);
        setCategory(catData);
        setStaffList(staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchData();
  }, [categoryId]);

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedNominee || !reason) return;

    // TODO: Get actual logged in user (nominator). For now, we omit nominator_id or use a mock if strictly required by RLS (but we disabled RLS)
    // In a real app with auth, we'd use useAuth().user.id

    setSubmitting(true);
    try {
      await createNomination({
        category_id: categoryId,
        nominee_id: selectedNominee.id,
        nominator_id: null, // Anonymous for now, or user ID if available
        reason: reason,
        status: 'pending',
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting nomination:', error);
      alert('Failed to submit nomination. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  if (!category) return <div>Category not found</div>;

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-20'>
      {/* Header */}
      <header className='flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 sticky top-0 z-10'>
        <div className='flex items-center gap-4'>
          <Link
            href='/'
            className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'>
            <span className='material-symbols-outlined'>arrow_back</span>
          </Link>
          <h1 className='text-lg font-bold text-gray-900 dark:text-white'>
            Nominate: {category.title}
          </h1>
        </div>
      </header>

      <div className='mx-auto max-w-5xl px-4 py-8'>
        {/* Category Info */}
        <section className='mb-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
            {category.title}
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            {category.description}
          </p>
        </section>

        {/* Search */}
        <section className='mb-6'>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500'>
              <span className='material-symbols-outlined'>search</span>
            </div>
            <input
              className='block w-full rounded-lg border-none bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700'
              placeholder='Search staff by name or department...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Staff Grid */}
        <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              onClick={() => setSelectedNominee(staff)}
              className={`cursor-pointer flex flex-col items-center rounded-xl p-6 shadow-sm transition-all duration-200 hover:border-primary ${
                selectedNominee?.id === staff.id
                  ? 'border-2 border-primary bg-white ring-4 ring-primary/20 dark:bg-gray-800'
                  : 'border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800'
              }`}>
              <div className='mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-100'>
                {staff.avatar ? (
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-gray-400'>
                    <span className='material-symbols-outlined text-4xl'>
                      person
                    </span>
                  </div>
                )}
              </div>
              <h3 className='text-center text-lg font-bold text-gray-900 dark:text-white'>
                {staff.name}
              </h3>
              <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
                {staff.position}
              </p>
              <p className='mt-1 text-center text-xs text-gray-400'>
                {staff.department}
              </p>
            </div>
          ))}
        </section>

        {/* Nomination Drawer/Modal (Simplifying as a fixed bottom bar/modal for now) */}
        {selectedNominee && (
          <div className='fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 p-4 transition-opacity'>
            <div className='w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl animate-in slide-in-from-bottom-10 fade-in'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Nominate {selectedNominee.name}
                </h3>
                <button
                  onClick={() => setSelectedNominee(null)}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400'>
                  <span className='material-symbols-outlined'>close</span>
                </button>
              </div>

              <div className='mb-4'>
                <p className='text-sm text-gray-500 mb-2'>
                  Why do they deserve this award?
                </p>
                <textarea
                  rows={4}
                  className='w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white'
                  placeholder='Share specific examples of their contributions...'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}></textarea>
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={() => setSelectedNominee(null)}
                  className='flex-1 rounded-lg border border-gray-300 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !reason}
                  className='flex-1 rounded-lg bg-primary py-2.5 font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50'>
                  {submitting ? 'Submitting...' : 'Submit Nomination'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {submitted && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 text-center shadow-xl'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600'>
                <span className='material-symbols-outlined text-4xl'>
                  check_circle
                </span>
              </div>
              <h3 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
                Nomination Sent!
              </h3>
              <p className='mb-6 text-gray-600 dark:text-gray-300'>
                Your nomination for <strong>{selectedNominee?.name}</strong> has
                been submitted successfully.
              </p>
              <button
                onClick={() => router.push('/')}
                className='w-full rounded-lg bg-primary py-3 font-bold text-white hover:bg-primary/90'>
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
