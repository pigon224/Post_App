import { useState } from "react";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
