export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return false
  }
}

export const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

export const getAllInvoices = () => {
  const invoices = loadFromStorage('invoices') || []
  return invoices
}

export const saveInvoice = (invoice) => {
  const invoices = getAllInvoices()
  const existingIndex = invoices.findIndex(inv => inv.invoiceNumber === invoice.invoiceNumber)
  
  if (existingIndex !== -1) {
    invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() }
  } else {
    invoices.push({ ...invoice, createdAt: new Date().toISOString() })
  }
  
  return saveToStorage('invoices', invoices)
}

export const deleteInvoice = (invoiceNumber) => {
  const invoices = getAllInvoices()
  const filteredInvoices = invoices.filter(inv => inv.invoiceNumber !== invoiceNumber)
  return saveToStorage('invoices', filteredInvoices)
}