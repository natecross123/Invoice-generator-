import React, { useState, useEffect } from 'react'
import InvoiceForm from './components/InvoiceForm'
import InvoicePreview from './components/InvoicePreview'
import { loadFromStorage, saveToStorage } from './utils/storage'

function App() {
  const [invoiceData, setInvoiceData] = useState(null)
  const [activeTab, setActiveTab] = useState('form')

  useEffect(() => {
    const savedData = loadFromStorage('currentInvoice')
    if (savedData) {
      setInvoiceData(savedData)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Invoice Generator</h1>
            <button
              onClick={handleNewInvoice}
              className="btn-secondary"
            >
              New Invoice
            </button>
          </div>
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
                Invoice Form
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'preview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!invoiceData}
              >
                Preview & Download
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