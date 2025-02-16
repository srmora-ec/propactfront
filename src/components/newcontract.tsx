import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.tsx';
import ButtonBack from './buttonback.tsx';

const NewContract = () => {
  const [contractData, setContractData] = useState({
    contractTitle: '',
    contractNumber: '',
    providerName: '',
    clientName: '',
    contractPurpose: '',
    startDate: '',
    endDate: '',
    amount: '',
    termsAndConditions: '',
    agreementChecked: false
  });

  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token') || '');
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/token/validate/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        navigate('/');
      }

    } catch (error) {
      console.error("Error fetching validate token:", error)
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContractData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractData(prevData => ({
      ...prevData,
      agreementChecked: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Token de acceso no encontrado');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/contrato/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Enviar el token de acceso en la cabecera
        },
        body: JSON.stringify({
          titulo: contractData.contractTitle,
          numero_contrato: contractData.contractNumber,
          nombre_proveedor: contractData.providerName,
          nombre_cliente: contractData.clientName,
          objeto: contractData.contractPurpose,
          fecha_inicio: contractData.startDate,
          fecha_finalizacion: contractData.endDate,
          monto: contractData.amount,
          terminos: contractData.termsAndConditions
        })
      });

      if (!response.ok) {
        // Leer el cuerpo del error, si está disponible
        validateToken();
        const errorResponse = await response.json().catch(() => null);
        throw new Error(
          `Error al crear el contrato: ${response.status} ${response.statusText}. Detalles: ${errorResponse ? JSON.stringify(errorResponse) : 'Sin detalles disponibles'
          }`
        );
      }

      const data = await response.json();
      console.log('Contrato creado con éxito:', data);
      alert('Contrato generado y listo para descargar');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Algo salió mal al crear el contrato');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken('')
    validateToken()
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar handleSubmit={handleLogout} />
      <ButtonBack/>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Nuevo Contrato</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contractTitle" className="block text-sm font-medium text-gray-700">Título del Contrato</label>
                    <input
                      type="text"
                      name="contractTitle"
                      id="contractTitle"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.contractTitle}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700">Número de Contrato</label>
                    <input
                      type="text"
                      name="contractNumber"
                      id="contractNumber"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.contractNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">Nombre del Proveedor</label>
                    <input
                      type="text"
                      name="providerName"
                      id="providerName"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.providerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.clientName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contractPurpose" className="block text-sm font-medium text-gray-700">Objeto del Contrato</label>
                    <textarea
                      name="contractPurpose"
                      id="contractPurpose"
                      rows={3}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.contractPurpose}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700">Términos y Condiciones</label>
                    <textarea
                      name="termsAndConditions"
                      id="termsAndConditions"
                      rows={5}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={contractData.termsAndConditions}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        id="agreementChecked"
                        name="agreementChecked"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={contractData.agreementChecked}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="agreementChecked" className="ml-2 block text-sm text-gray-900">
                        Acepto los términos y condiciones
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={!contractData.agreementChecked}
                    >
                      Guardar Contrato
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Error de la API */}
          {error && (
            <div className="mt-4 text-red-500 text-center">
              {error}
            </div>
          )}
          {/* Previsualización del Contrato */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Previsualización del Contrato</h2>
              <div className="border border-gray-300 p-4 rounded-md" style={{ minHeight: '297mm', width: '210mm', margin: '0 auto' }}>
                <h1 className="text-2xl font-bold mb-4">{contractData.contractTitle || 'Título del Contrato'}</h1>
                <p className="mb-2"><strong>Número de Contrato:</strong> {contractData.contractNumber}</p>
                <p className="mb-2"><strong>Proveedor:</strong> {contractData.providerName}</p>
                <p className="mb-2"><strong>Cliente:</strong> {contractData.clientName}</p>
                <p className="mb-4"><strong>Objeto del Contrato:</strong> {contractData.contractPurpose}</p>
                <p className="mb-2"><strong>Fecha de Inicio:</strong> {contractData.startDate}</p>
                <p className="mb-2"><strong>Fecha de Finalización:</strong> {contractData.endDate}</p>
                <p className="mb-4"><strong>Monto:</strong> ${contractData.amount}</p>
                <h2 className="text-xl font-semibold mb-2">Términos y Condiciones</h2>
                <p className="whitespace-pre-wrap">{contractData.termsAndConditions}</p>
                <div className="mt-8">
                  <p className="mb-4">Firmado en ____________ el día ____________</p>
                  <div className="flex justify-between">
                    <div>
                      <p>____________________</p>
                      <p>Firma del Proveedor</p>
                    </div>
                    <div>
                      <p>____________________</p>
                      <p>Firma del Cliente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default NewContract;
