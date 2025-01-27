import React from "react"
import { useState, useEffect } from "react"

interface Contrato {
  id: number
  titulo: string
  numero_contrato: string
  nombre_proveedor: string
  nombre_cliente: string
  objeto: string
  fecha_inicio: string
  fecha_finalizacion: string
  monto: string
  terminos: string
}

interface Clausula {
  id: number
  titulo: string
  descripcion: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

const ContractAssistant: React.FC = () => {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null)
  const [clausulas, setClausulas] = useState<Clausula[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token") || "")
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  useEffect(() => {
    fetchContratos()
    fetchClausulas()
  }, [])

  const fetchContratos = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/contrato/contratos/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch contratos")
      const data = await response.json()
      setContratos(data)
    } catch (error) {
      console.error("Error fetching contratos:", error)
    }
  }

  const fetchClausulas = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/clausula/clausulas/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Failed to fetch clausulas")
      const data = await response.json()
      setClausulas(data)
    } catch (error) {
      console.error("Error fetching clausulas:", error)
    }
  }

  const sendMessageToGemini = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDpkAuukrR-hsJ8e4e39pQNbuXbRqg8b4U', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: message }]
          }]
        }),
      });
      if (!response.ok) throw new Error('Failed to get response from Gemini');
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return 'Error: Unable to get response from AI assistant.';
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToChatPDF = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("https://api.chatpdf.com/v1/chats/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sec_XobYsLJgweltGYER2QZoNMZWAjFOV7ZN", // Replace with your actual API key
        },
        body: JSON.stringify({
          sourceId: "cha_tuphgIHW5sLPw2AxYUZqK", // Replace with your actual source ID
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response from ChatPDF")
      const data = await response.json()
      return data.content
    } catch (error) {
      console.error("Error sending message to ChatPDF:", error)
      return "Error: Unable to get response from ChatPDF."
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessageContent = (content: string) => {
    // Reemplaza primero **texto** por <strong>texto</strong>
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Luego, reemplaza * por <br/>
    formattedContent = formattedContent.replace(/\*(?!\*)/g, "<br/>");
    return formattedContent;
  };

  const evaluateContractEthics = async () => {
    if (!selectedContrato) return
    var clausulaMessage = "Toma en cuenta las siguientes clausulas";

    for (const clausula of clausulas) {
      clausulaMessage += `Clausula: ${clausula.titulo} - ${clausula.descripcion}`;
    }
    // Prepare the contract details
    const contractDetails = `
      Título: ${selectedContrato.titulo}
      Número de contrato: ${selectedContrato.numero_contrato}
      Proveedor: ${selectedContrato.nombre_proveedor}
      Cliente: ${selectedContrato.nombre_cliente}
      Objeto del contrato: ${selectedContrato.objeto}
      Fecha de inicio: ${selectedContrato.fecha_inicio}
      Fecha de finalización: ${selectedContrato.fecha_finalizacion}
      Monto: ${selectedContrato.monto}
      Términos del contrato: ${selectedContrato.terminos}
    `

    // Evaluate using Gemini
    const geminiMessage = clausulaMessage + `Basándote en las cláusulas que te he proporcionado anteriormente, evalúa si el siguiente contrato es ético. Verifica si hay errores de ortografía, fechas incorrectas o inconsistencias., pon texto en doble asterisco para ponerlo en negrita y pon un asterisco para que sea salto de linea. Aquí están los datos del contrato: ${contractDetails}`
    const geminiResponse = await sendMessageToGemini(geminiMessage)

    // Evaluate using ChatPDF
    const chatPDFMessage = `Indica si el siguiente contrato infringe algún artículo del código civil. No empieces tú respuesta con un -si infringe- empieza con un -el contrato infringe- o algo así si el contrato no infringe nada solo responde que esta bien, y recuerda nombrar el artículo correspondiente, pon texto en doble asterisco para ponerlo en negrita y pon un asterisco para que sea salto de linea. ${contractDetails}`
    const chatPDFResponse = await sendMessageToChatPDF(chatPDFMessage)

    // Combine responses
    setMessages((prev) => [...prev, { role: "assistant", content: "Evaluación de clausulas y ética:" }])
    setMessages((prev) => [...prev, { role: "assistant", content: geminiResponse }])
    setMessages((prev) => [...prev, { role: "assistant", content: "Evaluación del código civil:" }])
    setMessages((prev) => [...prev, { role: "assistant", content: chatPDFResponse }])
  }

  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }])
    const response = await sendMessageToGemini(message)
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
  }

  const sendMessagechat = async (message: string) => {
    if (!selectedContrato) return
    var clausulaMessage = "Toma en cuenta las siguientes clausulas";

    for (const clausula of clausulas) {
      clausulaMessage += `Clausula: ${clausula.titulo} - ${clausula.descripcion}`;
    }
    // Prepare the contract details
    const contractDetails = `
      Título: ${selectedContrato.titulo}
      Número de contrato: ${selectedContrato.numero_contrato}
      Proveedor: ${selectedContrato.nombre_proveedor}
      Cliente: ${selectedContrato.nombre_cliente}
      Objeto del contrato: ${selectedContrato.objeto}
      Fecha de inicio: ${selectedContrato.fecha_inicio}
      Fecha de finalización: ${selectedContrato.fecha_finalizacion}
      Monto: ${selectedContrato.monto}
      Términos del contrato: ${selectedContrato.terminos}
    `
    var messagef
    setMessages((prev) => [...prev, { role: "user", content: message }])
    const response = await sendMessageToGemini(clausulaMessage + "Para tratar el siguiente contrato" + contractDetails + "Y centrate en responder solo lo siguiente, no des información exagerada queremos conversaciones cortas y comodas sobre la etica del contrato. Pregunta:" + message)
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asistente de Contratos</h1>

      <div className="grid grid-cols-1 gap-4">
        {/* Lista de Contratos */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Contratos</h2>
          <ul>
            {contratos.map((contrato) => (
              <li
                key={contrato.id}
                className={`cursor-pointer p-2 hover:bg-gray-100 ${selectedContrato?.id === contrato.id ? "bg-blue-100" : ""}`}
                onClick={() => setSelectedContrato(contrato)}
              >
                {contrato.titulo}
              </li>
            ))}
          </ul>
        </div>

        {/* Previsualización del Contrato */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Vista Previa del Contrato</h2>
          {selectedContrato ? (
            <div>
              <div className="mt-8 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Previsualización del Contrato</h2>
                  <div
                    className="border border-gray-300 p-4 rounded-md"
                    style={{ minHeight: "297mm", width: "210mm", margin: "0 auto" }}
                  >
                    <h1 className="text-2xl font-bold mb-4">{selectedContrato.titulo || "Título del Contrato"}</h1>
                    <p className="mb-2">
                      <strong>Número de Contrato:</strong> {selectedContrato.numero_contrato}
                    </p>
                    <p className="mb-2">
                      <strong>Proveedor:</strong> {selectedContrato.nombre_proveedor}
                    </p>
                    <p className="mb-2">
                      <strong>Cliente:</strong> {selectedContrato.nombre_cliente}
                    </p>
                    <p className="mb-4">
                      <strong>Objeto del Contrato:</strong> {selectedContrato.objeto}
                    </p>
                    <p className="mb-2">
                      <strong>Fecha de Inicio:</strong> {selectedContrato.fecha_inicio}
                    </p>
                    <p className="mb-2">
                      <strong>Fecha de Finalización:</strong> {selectedContrato.fecha_finalizacion}
                    </p>
                    <p className="mb-4">
                      <strong>Monto:</strong> ${selectedContrato.monto}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Términos y Condiciones</h2>
                    <p className="whitespace-pre-wrap">{selectedContrato.terminos}</p>
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
              <button
                onClick={evaluateContractEthics}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                Evaluar Ética del Contrato
              </button>
            </div>
          ) : (
            <p>Selecciona un contrato para ver su contenido.</p>
          )}
        </div>
      </div>

      {/* Interfaz de Chat */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Conversación con el Asistente</h2>
        <div className="h-94 overflow-y-auto mb-4 border p-2">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
                dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} // Renderiza el contenido formateado
              ></span>
            </div>
          ))}
          {isLoading && <p className="text-center">Cargando respuesta...</p>}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement
            if (input.value.trim()) {
              sendMessagechat(input.value)
              input.value = ""
            }
          }}
        >
          <div className="flex">
            <input
              type="text"
              name="message"
              className="flex-grow mr-2 p-2 border rounded"
              placeholder="Escribe un mensaje..."
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContractAssistant

