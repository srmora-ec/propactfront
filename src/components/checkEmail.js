import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          📩 ¡Verifica tu correo!
        </h2>
        <p className="text-center text-gray-600">
          Te hemos enviado un enlace de verificación a tu correo. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 px-4 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Ya verifiqué mi cuenta
        </button>

        <p className="text-sm text-center text-gray-500">
          Si no encuentras el correo, revisa tu carpeta de spam.
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
