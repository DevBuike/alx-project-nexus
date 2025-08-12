import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="text-black  flex items-center gap-2 mb-7">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-1/2 max-w-md px-4 py-2 border border-black  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className=" px-4 py-2 bg-[#ffa800] text-white rounded-md hover:bg-[#ffa800f0] transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
