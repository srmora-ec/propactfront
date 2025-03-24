import React from 'react';
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Select, Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { jsPDF } from "jspdf"
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx"
import saveAs from "file-saver"
import { supabase } from './supabaseClient';

const { Option } = Select

interface Contract {
  id: number
  titulo: string
  numero_contrato: string
  nombre_proveedor: string
  nombre_cliente: string
  fecha_inicio: string
  fecha_finalizacion: string
  monto: string
  objeto: string
  terminos: string
}

const ContractListExport: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [exportFormat, setExportFormat] = useState<"pdf" | "word">("pdf")
  const navigate = useNavigate();



  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    const { data, error } = await supabase.from("contratos").select("*");
    if (error) {
      console.error("Error fetching contracts:", error);
    } else {
      setContracts(data);
    }
  };

  const exportToPdf = () => {
    if (!selectedContract) return
    const doc = new jsPDF()
    const margin = 20
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let y = margin
  
    // Título
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    const title = selectedContract.titulo
    const titleLines = doc.splitTextToSize(title, pageWidth - 2 * margin) // Dividimos el título si es demasiado largo
    const titleHeight = titleLines.length * 10 // Calculamos la altura total del título
  
    // Centrar el título
    y += (titleHeight / 2) // Ajustamos la posición vertical para que el título esté centrado en la página
    doc.text(titleLines, pageWidth / 2, y, { align: "center" })
    y += titleHeight + 15 // Ajustamos la posición para el siguiente contenido
  
    // Función para agregar contenido y cambiar de página si es necesario
    const addContentWithPageCheck = (content: string[]) => {
      content.forEach((line) => {
        if (y + 10 > pageHeight - margin) {
          doc.addPage() // Añadir una nueva página si el contenido se sale de la actual
          y = margin
        }
        doc.text(line, margin, y)
        y += 10
      })
    }
  
    // Detalles del contrato
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    const details = [
      `Número de Contrato: ${selectedContract.numero_contrato}`,
      `Proveedor: ${selectedContract.nombre_proveedor}`,
      `Cliente: ${selectedContract.nombre_cliente}`,
      `Fecha de Inicio: ${selectedContract.fecha_inicio}`,
      `Fecha de Finalización: ${selectedContract.fecha_finalizacion}`,
      `Monto: $${selectedContract.monto}`,
    ]
  
    addContentWithPageCheck(details)
  
    // Objeto del contrato (se divide si es muy largo)
    const objectText = `Objeto del Contrato: ${selectedContract.objeto}`
    const objectLines = doc.splitTextToSize(objectText, pageWidth - 2 * margin)
    addContentWithPageCheck(objectLines)
  
    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Términos y Condiciones", margin, y)
    y += 10
  
    // Términos y condiciones
    doc.setFont("helvetica", "normal")
    const splitTerms = doc.splitTextToSize(selectedContract.terminos, pageWidth - 2 * margin)
    if (y + splitTerms.length * 10 > pageHeight - margin) {
      doc.addPage() // Si los términos no caben en la página actual, añadimos una nueva
      y = margin
    }
    doc.text(splitTerms, margin, y)
  
    y = doc.internal.pageSize.height - 40
    doc.text("Firmado en ____________ el día ____________", margin, y)
    y += 20
    doc.text("____________________", margin, y)
    doc.text("Firma del Proveedor", margin, y + 10)
    doc.text("____________________", pageWidth - margin - 50, y)
    doc.text("Firma del Cliente", pageWidth - margin - 35, y + 10)
  
    doc.save(`${selectedContract.titulo}.pdf`)
  }
  

  const exportToWord = () => {
    if (!selectedContract) return
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: selectedContract.titulo,
              heading: "Heading1",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: `Número de Contrato: ${selectedContract.numero_contrato}` }),
            new Paragraph({ text: `Proveedor: ${selectedContract.nombre_proveedor}` }),
            new Paragraph({ text: `Cliente: ${selectedContract.nombre_cliente}` }),
            new Paragraph({ text: `Objeto del Contrato: ${selectedContract.objeto}` }),
            new Paragraph({ text: `Fecha de Inicio: ${selectedContract.fecha_inicio}` }),
            new Paragraph({ text: `Fecha de Finalización: ${selectedContract.fecha_finalizacion}` }),
            new Paragraph({ text: `Monto: $${selectedContract.monto}` }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Términos y Condiciones",
              heading: "Heading2",
            }),
            new Paragraph({ text: selectedContract.terminos }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Firmado en ____________ el día ____________" }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun("____________________"),
                new TextRun("                    "),
                new TextRun("____________________"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Firma del Proveedor"),
                new TextRun("                    "),
                new TextRun("Firma del Cliente"),
              ],
            }),
          ],
        },
      ],
    })

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${selectedContract.titulo}.docx`)
    })
  }

  const handleExport = () => {
    if (exportFormat === "pdf") {
      exportToPdf()
    } else {
      exportToWord()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exportar Contrato</h1>
      <div className="mb-4 flex items-center">
        <Select
          style={{ width: 300 }}
          placeholder="Seleccione un contrato"
          onChange={(value) => setSelectedContract(contracts.find((c) => c.id === value) || null)}
        >
          {contracts.map((contract) => (
            <Option key={contract.id} value={contract.id}>
              {contract.titulo}
            </Option>
          ))}
        </Select>
        <Select
          defaultValue="pdf"
          style={{ width: 120, marginLeft: 16 }}
          onChange={(value: "pdf" | "word") => setExportFormat(value)}
        >
          <Option value="pdf">PDF</Option>
          <Option value="word">Word</Option>
        </Select>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          className="ml-2"
          disabled={!selectedContract}
        >
          Exportar
        </Button>
      </div>
    </div>
  )
}

export default ContractListExport

