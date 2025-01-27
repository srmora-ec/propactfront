import React, { useState }  from 'react';
import { BookOpen, FileText, Bot, Clock, Download, Share2 } from 'lucide-react';
import { Modal } from 'antd';
import ContractListExport from './ContractListExport.tsx';

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); 

  // Función para mostrar el modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false); 
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Asistente de Contratos Éticos
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Biblioteca de cláusulas éticas */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Biblioteca de Cláusulas
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            Explorar
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/clausulas" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Acceder a la biblioteca
                    </a>
                  </div>
                </div>
              </div>

              {/* Creación de contratos */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Crear Contrato
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            Nuevo
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/newcontract" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Iniciar nuevo contrato
                    </a>
                  </div>
                </div>
              </div>

              {/* Asistente de ética */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Bot className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Asistente de Ética
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            Consultar
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="/assitente" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Iniciar asistente
                    </a>
                  </div>
                </div>
              </div>

              {/* Historial de cambios */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Historial de Cambios
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            Ver
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Revisar historial
                    </a>
                  </div>
                </div>
              </div>

              {/* Exportar contratos */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Download className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Exportar Contratos
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            PDF / Word
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                  <button
                      onClick={showModal} // Al hacer clic, abrimos el modal
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Exportar documento
                    </button>
                  </div>
                </div>
              </div>

              {/* Compartir contratos */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Share2 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Compartir Contratos
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            Enviar
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Compartir documento
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Modal
        width={"50%"}
        title="Exportando PDF"
        visible={isModalVisible} // El estado controla la visibilidad
        onCancel={handleCancel} // Función para cerrar el modal
        footer={null} // No necesitamos footer
      >
        <ContractListExport/>
      </Modal>
      </main>
    </div>
  );
};

export default Dashboard;

