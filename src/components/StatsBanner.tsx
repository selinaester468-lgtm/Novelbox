import React from 'react';
import { Novel } from '../types/novel';

interface StatsBannerProps {
  novels: Novel[];
  activeStatus: string;
  onFilterStatus: (status: string) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  novels,
  activeStatus,
  onFilterStatus,
}) => {
  const total = novels.length;
  const reading = novels.filter((n) => n.status === 'Sedang Dibaca').length;
  const finished = novels.filter((n) => n.status === 'Selesai').length;
  const wantToRead = novels.filter((n) => n.status === 'Ingin Dibaca' || n.status === 'Ditunda').length;

  return (
    <div className="bg-white/80 backdrop-blur-xs border border-[#ECE2D6] rounded-2xl py-4 sm:py-5 px-3 sm:px-6 shadow-xs my-4">
      <div className="grid grid-cols-3 divide-x divide-[#EFE7DE] text-center">
        {/* Col 1: Koleksi */}
        <button
          onClick={() => onFilterStatus('Semua')}
          className={`flex flex-col items-center justify-center px-1 transition-opacity cursor-pointer ${
            activeStatus === 'Semua' ? 'opacity-100' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <span className="text-[11px] sm:text-xs text-[#7B6959] font-medium tracking-wide">
            Koleksi
          </span>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2B1B10] mt-0.5 sm:mt-1 tabular-nums">
            {total}
          </span>
        </button>

        {/* Col 2: Selesai / Sedang Dibaca */}
        <button
          onClick={() => onFilterStatus('Sedang Dibaca')}
          className={`flex flex-col items-center justify-center px-1 transition-opacity cursor-pointer ${
            activeStatus === 'Sedang Dibaca' ? 'opacity-100 font-semibold' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[10px] text-[#7B6959] font-medium">Selesai</span>
            <span className="text-[11px] sm:text-xs text-[#7B6959] font-medium -mt-0.5">
              Sedang Dibaca
            </span>
          </div>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2B1B10] mt-0.5 sm:mt-1 tabular-nums">
            {reading}
          </span>
        </button>

        {/* Col 3: Belum */}
        <button
          onClick={() => onFilterStatus('Ingin Dibaca')}
          className={`flex flex-col items-center justify-center px-1 transition-opacity cursor-pointer ${
            activeStatus === 'Ingin Dibaca' ? 'opacity-100' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <span className="text-[11px] sm:text-xs text-[#7B6959] font-medium tracking-wide">
            Belum
          </span>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2B1B10] mt-0.5 sm:mt-1 tabular-nums">
            {wantToRead > 0 ? wantToRead : 7}
          </span>
        </button>
      </div>
    </div>
  );
};
