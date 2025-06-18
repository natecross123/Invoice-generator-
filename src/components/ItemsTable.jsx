import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import { calculateTotals } from '../utils/calculations'

const ItemsTable = ({ items, onItemsChange, discount, tax }) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      code: '',
      description: '',
      quantity: 1,
      price: 0,
      amount: 0
    }
    onItemsChange([...items, newItem])
  }

  const removeItem = (id) => {
    onItemsChange(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        // Calculate amount when quantity or price changes
        if (field === 'quantity' || field === 'price') {
          updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.price || 0)
        }
        
        return updatedItem
      }
      return item
    })
    onItemsChange(updatedItems)
  }

  const totals = calculateTotals(items, discount, tax)

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price (JMD)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (JMD)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.code}
                    onChange={(e) => updateItem(item.id, 'code', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Code"
                  />
                </td>
                <td className="px-3 py-4">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Description"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </button>

        <div className="text-right space-y-2">
          <div className="flex justify-between items-center min-w-64">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-medium">{formatCurrency(totals.subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Discount:</span>
              <span className="text-sm font-medium text-red-600">-{formatCurrency(discount)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tax ({tax}%):</span>
              <span className="text-sm font-medium">{formatCurrency(totals.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-primary-600">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemsTable