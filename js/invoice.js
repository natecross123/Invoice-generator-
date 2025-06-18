/* Modern Invoice Generator Styles */
:root {
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --secondary-color: #f59e0b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --light-color: #f9fafb;
  --dark-color: #111827;
  --border-color: #e5e7eb;
  --text-color: #374151;
  --background-color: #ffffff;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--text-color);
  background-color: #f3f4f6;
  min-height: 100vh;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3 {
  margin-bottom: 15px;
  color: var(--dark-color);
  font-weight: 700;
  line-height: 1.2;
}

h1 {
  font-size: 1.875rem;
}

h2 {
  font-size: 1.25rem;
  color: var(--primary-color);
}

/* Header Styles */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Main Content Layout */
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* Form Styles */
.invoice-form {
  background-color: var(--background-color);
  padding: 25px;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--dark-color);
}

input, select, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: var(--font-family);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

/* Logo Upload Section */
.logo-upload {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

#logo-preview {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f9fafb;
  transition: border-color 0.2s ease;
}

#logo-preview:hover {
  border-color: var(--primary-color);
}

#company-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

#logo-upload {
  display: none;
}

/* Invoice Items Table */
.invoice-items {
  overflow-x: auto;
}

#items-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 15px;
  border-radius: 6px;
  overflow: hidden;
}

#items-table th, 
#items-table td {
  padding: 12px;
  text-align: left;
}

#items-table th {
  background-color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--dark-color);
  border-bottom: 1px solid var(--border-color);
}

#items-table td {
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

#items-table tr:last-child td {
  border-bottom: none;
}

.item-amount {
  font-weight: 600;
}

/* Totals Section */
.totals-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 6px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-weight: 500;
}

.totals-row:last-child {
  border-top: 1px solid var(--border-color);
  margin-top: 10px;
  padding-top: 12px;
  font-weight: 700;
  font-size: 1.1em;
}

.discount-row {
  align-items: center;
}

.discount-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.discount-input label {
  margin-bottom: 0;
  font-size: 0.875rem;
}

.discount-input input {
  width: 100px;
}

.discount-input select {
  width: 150px;
}

/* Buttons */
.btn {
  padding: 10px 16px;
  background-color: var(--light-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: var(--font-family);
}

.btn:hover {
  background-color: #e5e7eb;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-success {
  background-color: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-danger {
  background-color: var(--danger-color);
  border-color: var(--danger-color);
  color: white;
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 4px;
}

.btn-danger:hover {
  background-color: #dc2626;
}

/* Add Item Button */
#add-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f3f4f6;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  width: 100%;
  justify-content: center;
  padding: 12px;
  margin: 15px 0;
  transition: all 0.2s ease;
}

#add-item:hover {
  background-color: #e5e7eb;
  border-color: var(--primary-color);
}

#add-item::before {
  content: "+";
  font-size: 1.2rem;
  margin-right: 5px;
}

/* Invoice Preview */
.invoice-preview {
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.preview-wrapper {
  padding: 25px;
  overflow: auto;
  max-height: calc(100vh - 100px);
}

.preview-content {
  min-height: 297mm; /* A4 height */
  width: 210mm; /* A4 width */
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 20mm;
  position: relative;
  border-radius: 2px;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  backdrop-filter: blur(4px);
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hidden {
  display: none;
}

/* Invoice Preview Styles */
/* These styles apply to the generated invoice HTML */

.invoice-header {
  margin-bottom: 25px;
}

.invoice-title {
  font-size: 28px;
  font-weight: 700;
  text-align: right;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.trn-number {
  text-align: right;
  color: var(--text-color);
}

.company-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  align-items: flex-start;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.company-address, .company-contacts {
  font-size: 14px;
  color: #4b5563;
}

.invoice-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 0;
}

.bill-to-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.client-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.invoice-info-row {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.invoice-info-row .label {
  font-weight: 500;
  color: #4b5563;
}

.invoice-info-row .value {
  font-weight: 600;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
}

.invoice-table th {
  background-color: #f8fafc;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.invoice-table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.amount-column {
  text-align: right;
}

.invoice-totals {
  width: 300px;
  margin-left: auto;
  background-color: #f8fafc;
  padding: 15px;
  border-radius: 6px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.total-row.grand-total {
  font-weight: 700;
  font-size: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 5px;
}

.payment-info {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.payment-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.payment-label {
  font-weight: 500;
  margin-bottom: 5px;
}

.invoice-footer {
  position: absolute;
  bottom: 20mm;
  width: calc(100% - 40mm);
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  padding: 10px 0;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 1200px) {
  main {
    grid-template-columns: 1fr;
  }
  
  .invoice-preview {
    position: relative;
    top: 0;
  }
  
  .preview-content {
    width: 100%;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .actions {
    margin-top: 15px;
    flex-wrap: wrap;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .logo-upload {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .totals-section {
    padding: 15px;
  }
  
  .discount-input {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .discount-input input,
  .discount-input select {
    width: 100%;
  }
}

/* Add Inter font for better typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');