import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import LogoUpload from './LogoUpload'
import ItemsTable from './ItemsTable'
import { formatDate } from '../utils/dateUtils'
import { calculateTotals } from '../utils/calculations'

const DOC_TYPES = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'quotation', label: 'Quotation' },
]

const InvoiceForm = ({ initialData, onUpdate, onPreview }) => {
  const [docType, setDocType] = useState(initialData?.docType || 'invoice')
  const isQuotation = docType === 'quotation'

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: buildDefaults(initialData, docType)
  })

  // When initialData changes (e.g. imported file), reset the form
  useEffect(() => {
    if (initialData) {
      setDocType(initialData.docType || 'invoice')
      reset(buildDefaults(initialData, initialData.docType || 'invoice'))
    }
  }, [initialData?.invoiceNumber, initialData?.docType])

  // When docType changes, update the document number prefix
  useEffect(() => {
    const currentNum = watch('invoiceNumber') || ''
    const hasOldPrefix = currentNum.startsWith('INV-') || currentNum.startsWith('QUO-')
    if (hasOldPrefix) {
      const suffix = currentNum.split('-').slice(1).join('-')
      setValue('invoiceNumber', `${isQuotation ? 'QUO' : 'INV'}-${suffix}`)
    }
  }, [docType])

  const [items, setItems] = useState(initialData?.items || [])
  const [logo, setLogo] = useState(initialData?.logo || null)

  const watchedValues = watch()

  useEffect(() => {
    const totals = calculateTotals(items, watchedValues.discount, watchedValues.tax)
    onUpdate({ ...watchedValues, docType, items, logo, ...totals })
  }, [watchedValues, items, logo, docType])

  const onSubmit = (data) => {
    const totals = calculateTotals(items, data.discount, data.tax)
    onUpdate({ ...data, docType, items, logo, ...totals })
    onPreview()
  }

  const docLabel = isQuotation ? 'Quotation' : 'Invoice'
  const numLabel = isQuotation ? 'Quotation Number' : 'Invoice Number'
  const dateLabel = isQuotation ? 'Quotation Date' : 'Invoice Date'
  const endDateLabel = isQuotation ? 'Valid Until' : 'Due Date'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Company Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Company Name *</label>
              <input
                {...register('company.name', { required: 'Company name is required' })}
                className="form-input"
                placeholder="Your Company Name"
              />
              {errors.company?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.company.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Address</label>
              <textarea {...register('company.address')} className="form-input" rows="3" placeholder="Company Address" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input {...register('company.phone')} className="form-input" placeholder="Phone Number" />
            </div>
            <div>
              <label className="form-label">Mobile</label>
              <input {...register('company.mobile')} className="form-input" placeholder="Mobile Number" />
            </div>
          </div>
          <div className="space-y-4">
            <LogoUpload onLogoChange={setLogo} currentLogo={logo} />
            <div>
              <label className="form-label">Email</label>
              <input {...register('company.email')} type="email" className="form-input" placeholder="company@email.com" />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input {...register('company.website')} className="form-input" placeholder="www.yourwebsite.com" />
            </div>
            <div>
              <label className="form-label">TRN</label>
              <input {...register('company.trn')} className="form-input" placeholder="Tax Registration Number" />
            </div>
          </div>
        </div>
      </div>

      {/* Document Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Document Type Dropdown */}
          <div>
            <label className="form-label">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="form-input"
            >
              {DOC_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">{numLabel} *</label>
            <input
              {...register('invoiceNumber', { required: `${docLabel} number is required` })}
              className="form-input"
            />
            {errors.invoiceNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">{dateLabel} *</label>
            <input
              {...register('invoiceDate', { required: `${dateLabel} is required` })}
              type="date"
              className="form-input"
            />
            {errors.invoiceDate && (
              <p className="text-red-500 text-sm mt-1">{errors.invoiceDate.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">{endDateLabel} *</label>
            <input
              {...register('dueDate', { required: `${endDateLabel} is required` })}
              type="date"
              className="form-input"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Client Name *</label>
            <input
              {...register('client.name', { required: 'Client name is required' })}
              className="form-input"
              placeholder="Client Name"
            />
            {errors.client?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.client.name.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Contact Person</label>
            <input {...register('client.contact')} className="form-input" placeholder="Contact Person" />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input {...register('client.phone')} className="form-input" placeholder="Phone Number" />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input {...register('client.email')} type="email" className="form-input" placeholder="client@email.com" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Address</label>
            <textarea {...register('client.address')} className="form-input" rows="2" placeholder="Client Address" />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h2>
        <ItemsTable
          items={items}
          onItemsChange={setItems}
          discount={watchedValues.discount}
          tax={watchedValues.tax}
        />
      </div>

      {/* Discount and Tax */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Adjustments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Discount (JMD)</label>
            <input
              {...register('discount', { valueAsNumber: true })}
              type="number" step="0.01" className="form-input" placeholder="0.00"
            />
          </div>
          <div>
            <label className="form-label">Tax/GCT (%)</label>
            <input
              {...register('tax', { valueAsNumber: true })}
              type="number" step="0.01" className="form-input" placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <label className="form-label">Notes</label>
            <textarea {...register('notes')} className="form-input" rows="3" placeholder="Additional notes or comments" />
          </div>
          <div>
            <label className="form-label">Terms &amp; Conditions</label>
            <textarea {...register('terms')} className="form-input" rows="4" placeholder="Payment terms and conditions" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Preview {docLabel}
        </button>
      </div>
    </form>
  )
}

function buildDefaults(initialData, docType) {
  const isQ = (docType || initialData?.docType) === 'quotation'
  return {
    invoiceNumber: initialData?.invoiceNumber || `${isQ ? 'QUO' : 'INV'}-${Date.now().toString().slice(-6)}`,
    invoiceDate: initialData?.invoiceDate || formatDate(new Date()),
    dueDate: initialData?.dueDate || formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    company: initialData?.company || { name: '', address: '', phone: '', mobile: '', email: '', website: '', trn: '' },
    client: initialData?.client || { name: '', contact: '', phone: '', email: '', address: '' },
    notes: initialData?.notes || '',
    terms: initialData?.terms || 'Payment methods:\n1. Cash\n2. Cheque payable to "[Company Name]"\n3. Direct deposit',
    discount: initialData?.discount || 0,
    tax: initialData?.tax || 0,
  }
}

export default InvoiceForm