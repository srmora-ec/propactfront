import React from "react";
import { useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          ✅ ¡Correo Verificado!
        </h2>
        <p className="text-center text-gray-600">
          Tu cuenta ha sido verificada correctamente. Ahora puedes acceder a todas las funciones.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 px-4 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
