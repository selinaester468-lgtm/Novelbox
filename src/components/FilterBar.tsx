import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C7767]">
        <Search className="w-5 h-5 stroke-[1.8]" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cari novel, penulis, genre..."
        className="w-full pl-11 pr-10 py-3.5 bg-white/80 border border-[#EBE3D7] rounded-2xl text-sm text-[#4E3929] placeholder-[#9E8B7C] outline-none shadow-xs transition-all focus:border-[#BA997D] focus:bg-white"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E8B7C] hover:text-[#554234] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface FilterChipsProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedGenre,
  setSelectedGenre,
  selectedStatus,
  setSelectedStatus,
}) => {
  const filterTabs = [
    { id: 'all', type: 'genre', label: 'Semua', value: 'Semua' },
    { id: 'romance', type: 'genre', label: 'Romance', value: 'Romance' },
    { id: 'fantasy', type: 'genre', label: 'Fantasy', value: 'Fantasy' },
    { id: 'horor', type: 'genre', label: 'Horor / Thriller', value: 'Horor / Thriller' },
    { id: 'drama', type: 'genre', label: 'Drama / Kehidupan', value: 'Drama / Kehidupan' },
    { id: 'komedi', type: 'genre', label: 'Komedi / Ringan', value: 'Komedi / Ringan' },
    { id: 'sedang', type: 'status', label: 'Sedang Dibaca', value: 'Sedang Dibaca' },
    { id: 'selesai', type: 'status', label: 'Selesai Dibaca', value: 'Selesai' },
    { id: 'belum', type: 'status', label: 'Belum Dibaca', value: 'Ingin Dibaca' },
  ];

  const handleChipClick = (tab: { type: string; value: string }) => {
    if (tab.type === 'genre') {
      setSelectedGenre(tab.value);
      setSelectedStatus('Semua');
    } else {
      setSelectedStatus(tab.value);
      setSelectedGenre('Semua');
    }
  };

  const isTabActive = (tab: { type: string; value: string }) => {
    if (tab.type === 'genre') {
      return selectedGenre === tab.value && (tab.value === 'Semua' ? selectedStatus === 'Semua' : true);
    } else {
      return selectedStatus === tab.value;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 mb-5">
      {filterTabs.map((tab) => {
        const active = isTabActive(tab);

        // Styling strictly replicating reference image
        let activeBg = 'bg-[#BE9F85] text-white border-[#BE9F85]';
        if (tab.id === 'selesai') {
          activeBg = 'bg-[#C4B89B] text-[#2F3B25] font-semibold border-[#B5A88B]';
        } else if (tab.id === 'sedang') {
          activeBg = 'bg-[#C9A88F] text-white border-[#C9A88F]';
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleChipClick(tab)}
            className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
              active
                ? `${activeBg} shadow-xs font-semibold`
                : 'bg-white text-[#523F32] border-[#E2D7CB] hover:border-[#CBBCAE]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
