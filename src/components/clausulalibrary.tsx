import React, { useState, useEffect } from 'react';

interface Clausula {
  id: number;
  titulo: string;
  descripcion: string;
}

const ClausulaLibrary: React.FC = () => {
  const [clausulas, setClausulas] = useState<Clausula[]>([]);
  const [newClausula, setNewClausula] = useState({ titulo: '', descripcion: '' });
  const [editingClausula, setEditingClausula] = useState<Clausula | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token') || ''); // Token de acceso desde localStorage
  useEffect(() => {
    fetchClausulas();
  }, []);

  const fetchClausulas = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/clausula/clausulas/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Añade el token en el encabezado Authorization
              'Content-Type': 'application/json', // Esto es opcional, ya que no estás enviando datos
            },
          });
      if (!response.ok) throw new Error('Failed to fetch clausulas');
      const data = await response.json();
      setClausulas(data);
    } catch (error) {
      console.error('Error fetching clausulas:', error);
    }
  };

  const handleCreateClausula = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/clausula/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Enviar el token de acceso en la cabecera
          },
        body: JSON.stringify(newClausula),
      });
      if (!response.ok) throw new Error('Failed to create clausula');
      await fetchClausulas();
      setNewClausula({ titulo: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating clausula:', error);
    }
  };

  const handleUpdateClausula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClausula) return;
    try {
      const response = await fetch(`http://localhost:8000/api/clausula/update/${editingClausula.id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        body: JSON.stringify(editingClausula),
      });
      if (!response.ok) throw new Error('Failed to update clausula');
      await fetchClausulas();
      setEditingClausula(null);
    } catch (error) {
      console.error('Error updating clausula:', error);
    }
  };

  const handleDeleteClausula = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/clausula/delete/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
      });
      if (!response.ok) throw new Error('Failed to delete clausula');
      await fetchClausulas();
    } catch (error) {
      console.error('Error deleting clausula:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Biblioteca de Cláusulas</h1>

      {/* Form for creating new clausula */}
      <form onSubmit={handleCreateClausula} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Cláusula</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titulo">
            Título
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="titulo"
            type="text"
            value={newClausula.titulo}
            onChange={(e) => setNewClausula({ ...newClausula, titulo: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="descripcion"
            value={newClausula.descripcion}
            onChange={(e) => setNewClausula({ ...newClausula, descripcion: e.target.value })}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Crear Cláusula
        </button>
      </form>

      {/* List of existing clausulas */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Cláusulas Existentes</h2>
        {clausulas.map((clausula) => (
          <div key={clausula.id} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{clausula.titulo}</h3>
            <p className="mb-2">{clausula.descripcion}</p>
            <button
              onClick={() => setEditingClausula(clausula)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteClausula(clausula.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Form for editing clausula */}
      {editingClausula && (
        <form onSubmit={handleUpdateClausula} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Editar Cláusula</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-titulo">
              Título
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="edit-titulo"
              type="text"
              value={editingClausula.titulo}
              onChange={(e) => setEditingClausula({ ...editingClausula, titulo: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-descripcion">
              Descripción
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="edit-descripcion"
              value={editingClausula.descripcion}
              onChange={(e) => setEditingClausula({ ...editingClausula, descripcion: e.target.value })}
              required
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            type="submit"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => setEditingClausula(null)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default ClausulaLibrary;

