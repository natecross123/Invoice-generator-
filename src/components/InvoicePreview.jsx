import React, { useRef } from 'react'
import { Download, Edit, Printer } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import { formatDisplayDate } from '../utils/dateUtils'
import { generatePDF } from '../utils/pdfGenerator'

const InvoicePreview = ({ data, onEdit }) => {
  const invoiceRef = useRef(null)

  const handleDownloadPDF = async () => {
    if (invoiceRef.current) {
      await generatePDF(invoiceRef.current, data.invoiceNumber)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center print:hidden">
        <button
          onClick={onEdit}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Edit size={16} className="mr-2" />
          Edit Invoice
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer size={16} className="mr-2" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-primary inline-flex items-center"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div 
        ref={invoiceRef}
        className="bg-white shadow-lg mx-auto max-w-4xl print:shadow-none print:max-w-none"
        style={{ minHeight: '11in' }}
      >
        <div className="p-8 print:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              {data.logo && (
                <img
                  src={data.logo}
                  alt="Company Logo"
                  className="h-16 w-auto"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                {data.company.trn && (
                  <p className="text-sm text-gray-600">TRN - {data.company.trn}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company and Invoice Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {data.company.name}
                {data.company.trn && (
                  <span className="text-sm font-normal text-gray-600 block">
                    TRN {data.company.trn}
                  </span>
                )}
              </h2>
              {data.company.address && (
                <p className="text-sm text-gray-600 whitespace-pre-line mb-2">
                  {data.company.address}
                </p>
              )}
              {data.company.phone && (
                <p className="text-sm text-gray-600">Phone: {data.company.phone}</p>
              )}
              {data.company.mobile && (
                <p className="text-sm text-gray-600">Mobile: {data.company.mobile}</p>
              )}
              {data.company.email && (
                <p className="text-sm text-gray-600">{data.company.email}</p>
              )}
              {data.company.website && (
                <p className="text-sm text-gray-600">{data.company.website}</p>
              )}
            </div>

            {/* Invoice Details */}
            <div className="text-right">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Invoice Number:</span>
                  <span className="text-sm text-gray-900 ml-2">{data.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Invoice Date:</span>
                  <span className="text-sm text-gray-900 ml-2">{formatDisplayDate(data.invoiceDate)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Payment Due:</span>
                  <span className="text-sm text-gray-900 ml-2">{formatDisplayDate(data.dueDate)}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-lg font-semibold text-gray-700">Amount Due (JMD):</span>
                  <span className="text-lg font-bold text-gray-900 ml-2">{formatCurrency(data.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">BILL TO</h3>
            <div className="text-sm text-gray-900">
              <p className="font-medium">{data.client.name}</p>
              {data.client.contact && <p>{data.client.contact}</p>}
              {data.client.phone && <p>{data.client.phone}</p>}
              {data.client.email && <p>{data.client.email}</p>}
              {data.client.address && (
                <p className="whitespace-pre-line">{data.client.address}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">
                      <div>
                        {item.code && (
                          <span className="text-sm font-medium text-gray-900">[{item.code}] </span>
                        )}
                        <span className="text-sm text-gray-900">{item.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatCurrency(data.subtotal)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-red-600">-{formatCurrency(data.discount)}</span>
                </div>
              )}
              {data.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({data.tax}%):</span>
                  <span className="text-gray-900">{formatCurrency(data.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(data.total)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Amount Due (JMD):</span>
                <span>{formatCurrency(data.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="space-y-6">
            {data.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{data.notes}</p>
              </div>
            )}
            
            {data.terms && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes / Terms</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {data.terms.replace('[Company Name]', data.company.name)}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t text-center">
            <p className="text-sm text-gray-500">
              Thank you for choosing {data.company.name}!
              {data.company.website && ` ${data.company.website}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreview