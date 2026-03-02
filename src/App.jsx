import React, { useState, useEffect, useRef } from 'react'
import InvoiceForm from './components/InvoiceForm'
import InvoicePreview from './components/InvoicePreview'
import { loadFromStorage, saveToStorage } from './utils/storage'
import { Upload, FileText } from 'lucide-react'

function App() {
  const [invoiceData, setInvoiceData] = useState(null)
  const [activeTab, setActiveTab] = useState('form')
  const [importError, setImportError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const savedData = loadFromStorage('currentInvoice')
    if (savedData) setInvoiceData(savedData)
  }, [])

  const handleInvoiceUpdate = (data) => {
    setInvoiceData(data)
    saveToStorage('currentInvoice', data)
  }

  const handleNewInvoice = () => {
    setInvoiceData(null)
    localStorage.removeItem('currentInvoice')
    setActiveTab('form')
  }

  const handleImportClick = () => {
    setImportError(null)
    fileInputRef.current?.click()
  }

  const handleFileImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data.invoiceNumber && !data.docType) {
          setImportError('File does not appear to be a valid invoice/quotation file.')
          return
        }
        setInvoiceData(data)
        saveToStorage('currentInvoice', data)
        setActiveTab('form')
        setImportError(null)
      } catch {
        setImportError('Could not read the file. Make sure it is a valid exported .json file.')
      }
    }
    reader.readAsText(file)
  }

  const docType = invoiceData?.docType || 'invoice'
  const docLabel = docType === 'quotation' ? 'Quotation' : 'Invoice'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice &amp; Quotation Generator
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                <Upload size={15} />
                Import File
              </button>
              <button onClick={handleNewInvoice} className="btn-secondary text-sm">
                New Document
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>
          </div>
          {importError && (
            <div className="pb-3">
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
                {importError}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('form')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'form'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {docLabel} Form
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                disabled={!invoiceData}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'preview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preview &amp; Download
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'form' && (
              <InvoiceForm
                initialData={invoiceData}
                onUpdate={handleInvoiceUpdate}
                onPreview={() => setActiveTab('preview')}
              />
            )}
            {activeTab === 'preview' && invoiceData && (
              <InvoicePreview
                data={invoiceData}
                onEdit={() => setActiveTab('form')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App