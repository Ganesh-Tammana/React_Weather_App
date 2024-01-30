import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const colorClasses = {
  emerald: 'text-emerald-500',
  orange: 'text-orange-500',
  sky: 'text-sky-500',
  gray: 'text-gray-400',
  green: 'text-green-500',
  pink: 'text-red-600',
};

export default function Card({ title, icon, color, value, symbol }) {
  
  const textColorClass = colorClasses[color];

  return (
    <div className="bg-opacity-30 backdrop-filter backdrop-blur bg-black gap-2 lg:p-3 md:p-1 p-4 flex flex-col justify-around rounded-lg">
      <div className="flex gap-2">
        <FontAwesomeIcon icon={icon} className={`md:text-2xl lg:text-3xl text-4xl transition-transform transform ${textColorClass} hover:scale-110 lg:hover:${textColorClass}`} />
        <h1 className={`text-violet-200 md:text-2xl lg:text-lg font-semibold text-[20px] `}>{title}</h1>
      </div>
      <div>
        <h1 className={`text-violet-200 lg:text-xl md:text-[calc(22px)] text-[calc(25px)] font-extrabold `}>{value} {symbol}</h1>
      </div>
    </div>
  );
}
