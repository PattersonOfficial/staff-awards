interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ 
  placeholder = 'Search...', 
  value = '', 
  onChange 
}: SearchBarProps) {
  return (
    <div className="flex-grow max-w-md">
      <label className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-text-light-secondary dark:text-text-dark-secondary">
          search
        </span>
        <input
          type="search"
          className="w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2.5 pl-10 pr-4 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </label>
    </div>
  );
}
