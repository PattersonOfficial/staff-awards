'use client';

import { mockCategories } from '@/data/mockData';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Award Categories
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
              Manage award categories and their settings
            </p>
          </div>
          <Link
            href="/admin/categories/create"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Create Category</span>
          </Link>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">
                  search
                </span>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary"
                  placeholder="Search categories..."
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined text-base">filter_list</span>
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-dark-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {mockCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden">
                          <img
                            className="h-10 w-10 object-cover"
                            src={category.image}
                            alt={category.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                            {category.title}
                          </div>
                          <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary line-clamp-1">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/50 px-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                        {category.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {category.nominationDeadline}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                          category.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : category.status === 'draft'
                            ? 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-primary hover:text-primary/80">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
