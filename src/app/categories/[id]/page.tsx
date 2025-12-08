'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import StaffCard from '@/components/ui/StaffCard';
import SearchBar from '@/components/ui/SearchBar';
import { mockCategories, mockStaff } from '@/data/mockData';

export default function CategoryPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const category = mockCategories.find((c) => c.id === params.id);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Category not found</p>
      </div>
    );
  }

  const filteredStaff = mockStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-2">
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white text-base font-medium leading-normal" href="/">
              All Categories
            </a>
            <span className="text-text-light-secondary dark:text-text-dark-secondary text-base font-medium leading-normal">/</span>
            <span className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal">
              {category.title}
            </span>
          </div>

          <div className="flex flex-col gap-4 bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h1 className="text-text-light-primary dark:text-text-dark-primary text-4xl font-black leading-tight tracking-[-0.033em]">
              {category.title}
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">
              {category.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">
                calendar_today
              </span>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                Nominations close: {category.nominationDeadline}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <SearchBar
              placeholder="Search by name or department..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                <button className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined">view_list</span>
                </button>
                <button className="p-2 rounded-md text-white bg-primary">
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
              </div>
              <button 
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                disabled={!selectedStaffId}
              >
                <span className="truncate">Nominate Staff</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStaff.map((staff) => (
              <StaffCard
                key={staff.id}
                staff={staff}
                selected={selectedStaffId === staff.id}
                onClick={() => setSelectedStaffId(staff.id)}
              />
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-light-secondary dark:text-text-dark-secondary">
                No staff members found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
