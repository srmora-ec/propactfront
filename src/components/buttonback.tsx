import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ButtonBack = () => {
  return (
    <div className="flex justify-end p-4">
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-lg shadow-md transition duration-300"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Atrás
      </button>
    </div>
  );
};

export default ButtonBack;
