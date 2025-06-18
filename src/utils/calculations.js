export const calculateTotals = (items, discount = 0, taxRate = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.amount || 0)
  }, 0)
  
  const discountAmount = discount || 0
  const subtotalAfterDiscount = subtotal - discountAmount
  const taxAmount = (subtotalAfterDiscount * (taxRate || 0)) / 100
  const total = subtotalAfterDiscount + taxAmount
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    tax: taxRate || 0
  }
}

export const calculateItemAmount = (quantity, price) => {
  return Math.round((quantity || 0) * (price || 0) * 100) / 100
}