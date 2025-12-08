'use client';

import Link from 'next/link';

export default function CreateCategoryPage() {
  return (
    <main className='flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark'>
      <div className='flex-1 p-8'>
        {/* Breadcrumbs */}
        <div className='flex flex-wrap items-center gap-2 mb-6'>
          <Link
            className='text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary'
            href='/admin'>
            Admin Dashboard
          </Link>
          <span className='material-symbols-outlined text-sm text-gray-400'>
            chevron_right
          </span>
          <Link
            className='text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary'
            href='/admin/categories'>
            Awards
          </Link>
          <span className='material-symbols-outlined text-sm text-gray-400'>
            chevron_right
          </span>
          <span className='text-gray-800 dark:text-white text-sm font-medium leading-normal'>
            Create Category
          </span>
        </div>

        {/* Page Heading */}
        <div className='flex flex-wrap justify-between gap-3 mb-8'>
          <h1 className='text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72'>
            Create New Award Category
          </h1>
        </div>

        {/* Form Container */}
        <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8'>
          <form className='space-y-8' onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Category Details */}
            <div>
              <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                Category Details
              </h3>
              <div className='grid grid-cols-1 gap-6 mt-6'>
                {/* Category Name */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Category Name
                  </p>
                  <input
                    className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal'
                    placeholder='e.g., Innovator of the Year'
                  />
                </label>

                {/* Description */}
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Description
                  </p>
                  <textarea
                    className='appearance-none block w-full min-w-0 resize-y overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-28 placeholder:text-gray-400 p-4 text-base font-normal leading-normal'
                    placeholder='Describe what this award recognizes...'></textarea>
                </label>

                {/* File Uploader */}
                <div>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Category Icon or Image
                  </p>
                  <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-400 dark:border-gray-600 px-6 py-10'>
                    <div className='text-center'>
                      <span className='material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500'>
                        cloud_upload
                      </span>
                      <div className='mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300 justify-center'>
                        <label className='relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-background-dark hover:text-primary/80'>
                          <span>Upload a file</span>
                          <input
                            className='sr-only'
                            name='file-upload'
                            type='file'
                          />
                        </label>
                        <p className='pl-1'>or drag and drop</p>
                      </div>
                      <p className='text-xs leading-5 text-gray-500 dark:text-gray-400'>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Timeline */}
            <div>
              <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                Timeline
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6'>
                {/* Nomination Period */}
                <div className='space-y-6'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium'>
                    Nomination Period
                  </p>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      Start Date & Time
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      End Date & Time
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                </div>
                {/* Voting Period */}
                <div className='space-y-6'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium'>
                    Voting Period
                  </p>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      Start Date & Time
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                  <label className='flex flex-col'>
                    <p className='text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pb-2'>
                      End Date & Time
                    </p>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary h-12 px-4 text-base font-normal leading-normal'
                      type='datetime-local'
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Eligibility */}
            <div>
              <h3 className='text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-b border-gray-200 dark:border-gray-800'>
                Eligibility
              </h3>
              <div className='grid grid-cols-1 gap-6 mt-6'>
                <label className='flex flex-col'>
                  <p className='text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2'>
                    Eligible Staff
                  </p>
                  <div className='relative'>
                    <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                      search
                    </span>
                    <input
                      className='appearance-none block w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-gray-400 pl-10 pr-4 text-base font-normal leading-normal'
                      placeholder='Search by name or department...'
                    />
                  </div>
                </label>
                <div className='flex flex-wrap gap-2 p-3 min-h-[48px] rounded-lg bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-800'>
                  <span className='inline-flex items-center gap-x-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary'>
                    Jane Doe
                    <button className='flex-shrink-0 size-4 inline-flex items-center justify-center rounded-full hover:bg-primary/20 focus:outline-none focus:bg-primary/30'>
                      <span className='sr-only'>Remove Jane Doe</span>
                      <span className='material-symbols-outlined text-sm'>
                        close
                      </span>
                    </button>
                  </span>
                  <span className='inline-flex items-center gap-x-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary'>
                    John Smith
                    <button className='shrink-0 size-4 inline-flex items-center justify-center rounded-full hover:bg-primary/20 focus:outline-none focus:bg-primary/30'>
                      <span className='sr-only'>Remove John Smith</span>
                      <span className='material-symbols-outlined text-sm'>
                        close
                      </span>
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800'>
              <Link
                href='/admin/categories'
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'>
                <span className='truncate'>Cancel</span>
              </Link>
              <button
                className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90'
                type='submit'>
                <span className='truncate'>Create Category</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
