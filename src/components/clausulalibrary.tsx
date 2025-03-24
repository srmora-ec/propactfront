import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.tsx';
import ButtonBack from './buttonback.tsx';
import { supabase } from "./supabaseClient";

interface Clausula {
  id: number;
  titulo: string;
  descripcion: string;
}

const ClausulaLibrary: React.FC = () => {
  const [clausulas, setClausulas] = useState<Clausula[]>([]);
  const [newClausula, setNewClausula] = useState({ titulo: '', descripcion: '' });
  const [editingClausula, setEditingClausula] = useState<Clausula | null>(null);
  const navigate = useNavigate();



const fetchClausulas = async () => {
  const { data, error } = await supabase
    .from("clausulas")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    console.error("Error fetching clausulas:", error);
  } else {
    setClausulas(data);
  }
};



  useEffect(() => {
    fetchClausulas();
  }, []);


  const handleCreateClausula = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
  
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }
  
    const { error } = await supabase.from("clausulas").insert([
      {
        titulo: newClausula.titulo,
        descripcion: newClausula.descripcion,
        user_id: user.id,
      },
    ]);
  
    if (error) {
      console.error("Error creando cláusula:", error);
    } else {
      fetchClausulas();
      setNewClausula({ titulo: "", descripcion: "" });
    }
  };

  const handleUpdateClausula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClausula) return;
  
    const { error } = await supabase
      .from("clausulas")
      .update({
        titulo: editingClausula.titulo,
        descripcion: editingClausula.descripcion,
      })
      .eq("id", editingClausula.id);
  
    if (error) {
      console.error("Error actualizando cláusula:", error);
    } else {
      fetchClausulas();
      setEditingClausula(null);
    }
  };

  const handleDeleteClausula = async (id: number) => {
    const { error } = await supabase.from("clausulas").delete().eq("id", id);
  
    if (error) {
      console.error("Error eliminando cláusula:", error);
    } else {
      fetchClausulas();
    }
  };
 const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  }

  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar handleSubmit={handleLogout} />
      <ButtonBack/>
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
    </div>
  );
};

export default ClausulaLibrary;

