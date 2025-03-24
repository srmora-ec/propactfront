import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate("/home");
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (isRegistering) {
      if (!username) {
        setError("Por favor, ingresa un nombre de usuario.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    try {
      let response;
      if (isRegistering) {
        // Registro
        response = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });
      } else {
        // Inicio de sesión
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) throw response.error;

      if(isRegistering){
        navigate("/check")
        return
      }
      navigate("/home");
    } catch (err) {
      setError(err.message || "Error en la autenticación.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          )}

          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          {isRegistering && (
            <input
              type="password"
              placeholder="Repetir Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isRegistering ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <p
          className="text-sm text-center text-blue-500 cursor-pointer hover:underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
