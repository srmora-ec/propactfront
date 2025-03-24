import React from "react";
import "./LoadingScreen.css"; // Asegúrate de importar los estilos

const LoadingScreen = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
