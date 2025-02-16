import React from 'react';
import { LogOut } from 'lucide-react';

interface NavbarProps {
    handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }
  
  const Navbar: React.FC<NavbarProps> = ({ handleSubmit }) => {
    return (
        <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Asistente de Contratos Éticos</h1>
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>
      );
    };
    
    export default Navbar;
