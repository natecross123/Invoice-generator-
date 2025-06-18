export const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount) || 0
  return `J$${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const formatNumber = (number, decimals = 2) => {
  const num = parseFloat(number) || 0
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}