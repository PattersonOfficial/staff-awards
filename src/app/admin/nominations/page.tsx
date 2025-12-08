'use client';

import { useState, useMemo } from 'react';
import { mockNominations, mockCategories } from '@/data/mockData';
import AdminHeader from '@/components/layout/AdminHeader';

export default function NominationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [topCount, setTopCount] = useState<number>(5);

  // Aggregate nominations by (Nominee + Category)
  const aggregatedNominees = useMemo(() => {
    const map = new Map<
      string,
      {
        nomineeId: string;
        nomineeName: string;
        nomineeAvatar: string;
        nomineeEmail: string;
        department: string;
        categoryId: string;
        categoryTitle: string;
        count: number;
      }
    >();

    mockNominations.forEach((nom) => {
      const key = `${nom.nomineeId}-${nom.categoryId}`;
      if (!map.has(key)) {
        map.set(key, {
          nomineeId: nom.nomineeId,
          nomineeName: nom.nominee.name,
          nomineeAvatar: nom.nominee.avatar,
          nomineeEmail: nom.nominee.email,
          department: nom.nominee.department,
          categoryId: nom.categoryId,
          categoryTitle: nom.category.title,
          count: 0,
        });
      }
      map.get(key)!.count += 1;
    });

    return Array.from(map.values());
  }, []);

  const filteredNominees = aggregatedNominees.filter((item) => {
    const matchesSearch =
      item.nomineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.categoryId === selectedCategory
      : true;
    const matchesDepartment = selectedDepartment
      ? item.department === selectedDepartment
      : true;

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  // Sort by count desc
  const sortedNominees = [...filteredNominees].sort(
    (a, b) => b.count - a.count
  );

  return (
    <main className='flex flex-1 flex-col overflow-y-auto'>
      <AdminHeader title='Shortlist Nominees' />

      <div className='flex-1 p-8'>
        {/* PageHeading */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-text-light-primary dark:text-text-dark-primary text-3xl font-black leading-tight tracking-[-0.033em]'>
              Shortlist Nominees
            </h1>
            <p className='text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal'>
              Review, filter, and select the final nominees for each award
              category.
            </p>
          </div>
        </div>

        <div className='bg-card-light dark:bg-card-dark rounded-xl shadow-soft border border-border-light dark:border-border-dark p-4'>
          {/* Toolbar & Filters */}
          <div className='flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-2 mb-4'>
            {/* SearchBar */}
            <div className='w-full md:max-w-xs'>
              <label className='flex flex-col min-w-40 h-10 w-full'>
                <div className='flex w-full flex-1 items-stretch rounded-lg h-full'>
                  <div className='text-text-light-secondary dark:text-text-dark-secondary flex border border-r-0 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark items-center justify-center pl-3 rounded-l-lg'>
                    <span className='material-symbols-outlined text-xl'>
                      search
                    </span>
                  </div>
                  <input
                    className='flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-full placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary px-3 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal'
                    placeholder='Search by name, department...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Chips / Filters */}
            <div className='flex flex-wrap gap-2 items-center'>
              <div className='relative'>
                <select
                  className='appearance-none flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light dark:bg-background-dark px-3 pr-8 border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium focus:ring-primary/50'
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value=''>All Categories</option>
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <span className='material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary text-xl pointer-events-none'>
                  expand_more
                </span>
              </div>

              <div className='relative'>
                <select
                  className='appearance-none flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light dark:bg-background-dark px-3 pr-8 border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium focus:ring-primary/50'
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}>
                  <option value=''>All Departments</option>
                  {Array.from(
                    new Set(aggregatedNominees.map((n) => n.department))
                  )
                    .sort()
                    .map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                </select>
                <span className='material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary text-xl pointer-events-none'>
                  expand_more
                </span>
              </div>

              <div className='flex items-center gap-2 pl-2'>
                <label
                  className='text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary whitespace-nowrap'
                  htmlFor='select-top'>
                  Select Top:
                </label>
                <input
                  className='w-20 h-9 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-primary/50 focus:border-primary/50 text-sm px-2'
                  id='select-top'
                  type='number'
                  value={topCount}
                  onChange={(e) => setTopCount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Nominees Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left text-text-light-secondary dark:text-text-dark-secondary'>
              <thead className='text-xs text-text-light-primary dark:text-text-dark-primary uppercase bg-background-light dark:bg-background-dark'>
                <tr>
                  <th className='p-4 w-4' scope='col'>
                    <input
                      className='rounded border-border-light dark:border-border-dark text-primary focus:ring-primary/50 bg-transparent'
                      type='checkbox'
                    />
                  </th>
                  <th className='px-6 py-3' scope='col'>
                    Nominee Name
                  </th>
                  <th className='px-6 py-3' scope='col'>
                    Department
                  </th>
                  <th className='px-6 py-3' scope='col'>
                    Award Category
                  </th>
                  <th className='px-6 py-3 text-center' scope='col'>
                    Nominations
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedNominees.length > 0 ? (
                  sortedNominees.map((item, index) => (
                    <tr
                      key={`${item.nomineeId}-${item.categoryId}`}
                      className='bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-gray-800/50'>
                      <td className='p-4 w-4'>
                        <input
                          className='rounded border-border-light dark:border-border-dark text-primary focus:ring-primary/50 bg-transparent'
                          type='checkbox'
                          defaultChecked={index < topCount}
                        />
                      </td>
                      <th
                        className='px-6 py-4 font-medium text-text-light-primary dark:text-text-dark-primary whitespace-nowrap flex items-center gap-3'
                        scope='row'>
                        <img
                          className='w-10 h-10 rounded-full object-cover'
                          src={item.nomineeAvatar}
                          alt={`${item.nomineeName} avatar`}
                        />
                        {item.nomineeName}
                      </th>
                      <td className='px-6 py-4'>{item.department}</td>
                      <td className='px-6 py-4'>{item.categoryTitle}</td>
                      <td className='px-6 py-4 text-center'>
                        <span className='bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-semibold px-2.5 py-0.5 rounded-full'>
                          {item.count}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-8 text-center text-text-light-secondary dark:text-text-dark-secondary'>
                      No nominees found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Bar & Publish Button */}
          <div className='sticky bottom-0 mt-4 p-4 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark flex justify-between items-center rounded-b-xl -m-4'>
            <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
              <span className='font-semibold text-text-light-primary dark:text-text-dark-primary'>
                {Math.min(topCount, sortedNominees.length)}
              </span>{' '}
              nominees selected
            </p>
            <button className='flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-wide min-w-0 px-4 shadow-sm hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 dark:focus:ring-offset-slate-900'>
              <span className='material-symbols-outlined text-lg'>send</span>
              <span className='truncate'>Publish Final Nominees</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
