// Main application entry point
import { InvoiceManager } from './invoice.js';
import { PDFGenerator } from './pdf-generator.js';
import { StorageManager } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    const invoiceManager = new InvoiceManager();
    const pdfGenerator = new PDFGenerator();
    const storageManager = new StorageManager();
    
    // Set today's date as default for invoice date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    // Set default due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('payment-due').value = dueDate.toISOString().split('T')[0];
    
    // Generate default invoice number
    const defaultInvoiceNumber = generateInvoiceNumber();
    document.getElementById('invoice-number').value = defaultInvoiceNumber;
    
    // Add first item row
    addItemRow();
    
    // Setup event listeners
    setupEventListeners(invoiceManager, pdfGenerator, storageManager);
    
    // Check for saved draft and prompt to load
    checkForSavedDraft(storageManager);
});

function setupEventListeners(invoiceManager, pdfGenerator, storageManager) {
    // Logo upload
    const logoUploadBtn = document.getElementById('upload-logo-btn');
    const logoInput = document.getElementById('logo-upload');
    
    logoUploadBtn.addEventListener('click', () => {
        logoInput.click();
    });
    
    logoInput.addEventListener('change', handleLogoUpload);
    
    // Add item button
    document.getElementById('add-item').addEventListener('click', addItemRow);
    
    // Item table event delegation for dynamic elements
    document.getElementById('items-table').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item')) {
            deleteItemRow(e.target.closest('tr'));
            updateCalculations();
        }
    });
    
    // Input events for calculations
    document.getElementById('items-table').addEventListener('input', (e) => {
        if (e.target.classList.contains('item-quantity') || 
            e.target.classList.contains('item-price')) {
            updateRowAmount(e.target.closest('tr'));
            updateCalculations();
        }
    });
    
    // Discount changes
    document.getElementById('discount').addEventListener('input', updateCalculations);
    document.getElementById('discount-type').addEventListener('change', updateCalculations);
    
    // Preview button
    document.getElementById('preview-invoice').addEventListener('click', () => {
        const invoiceData = invoiceManager.collectFormData();
        const previewHtml = invoiceManager.generateInvoiceHTML(invoiceData);
        document.getElementById('preview-content').innerHTML = previewHtml;
    });
    
    // Download PDF button
    document.getElementById('download-pdf').addEventListener('click', async () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('hidden');
        
        try {
            const invoiceData = invoiceManager.collectFormData();
            await pdfGenerator.generatePDF(invoiceData);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating your PDF. Please try again.');
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    });
    
    // Save draft button
    document.getElementById('save-draft').addEventListener('click', () => {
        const invoiceData = invoiceManager.collectFormData();
        storageManager.saveDraft(invoiceData);
        alert('Invoice draft saved successfully!');
    });
    
    // Load draft button
    document.getElementById('load-draft').addEventListener('click', () => {
        const savedDraft = storageManager.loadDraft();
        if (savedDraft) {
            invoiceManager.populateFormWithData(savedDraft);
            updateCalculations();
            alert('Draft loaded successfully!');
        } else {
            alert('No saved draft found.');
        }
    });
    
    // New invoice button
    document.getElementById('new-invoice').addEventListener('click', () => {
        if (confirm('Are you sure you want to create a new invoice? Any unsaved changes will be lost.')) {
            clearForm();
            document.getElementById('invoice-date').value = new Date().toISOString().split('T')[0];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);
            document.getElementById('payment-due').value = dueDate.toISOString().split('T')[0];
            document.getElementById('invoice-number').value = generateInvoiceNumber();
            addItemRow();
        }
    });
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const logoImg = document.getElementById('company-logo');
            logoImg.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
    }
}

function addItemRow() {
    const tbody = document.getElementById('item-rows');
    const template = document.getElementById('item-row-template');
    const clone = document.importNode(template.content, true);
    
    tbody.appendChild(clone);
    
    // Focus on the first input of the new row
    const newRow = tbody.lastElementChild;
    const firstInput = newRow.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }
}

function deleteItemRow(row) {
    if (document.querySelectorAll('#item-rows tr').length > 1) {
        row.remove();
    } else {
        // If it's the last row, just clear it instead of removing
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = input.type === 'number' ? (input.min || 0) : '';
        });
        row.querySelector('.item-amount').textContent = '0.00';
    }
}

function updateRowAmount(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const amount = quantity * price;
    
    row.querySelector('.item-amount').textContent = amount.toFixed(2);
}

function updateCalculations() {
    let subtotal = 0;
    
    // Calculate subtotal from all items
    document.querySelectorAll('.item-row').forEach(row => {
        const amountText = row.querySelector('.item-amount').textContent;
        subtotal += parseFloat(amountText) || 0;
    });
    
    // Update subtotal display
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    
    // Calculate discount
    const discountValue = parseFloat(document.getElementById('discount').value) || 0;
    const discountType = document.getElementById('discount-type').value;
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
        discountAmount = (subtotal * (discountValue / 100));
    } else { // fixed
        discountAmount = discountValue;
    }
    
    // Update discount amount display
    document.getElementById('discount-amount').textContent = discountAmount.toFixed(2);
    
    // Calculate and update total
    const total = subtotal - discountAmount;
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${randomDigits}`;
}

function clearForm() {
    // Clear company info
    document.getElementById('company-name').value = '';
    document.getElementById('company-trn').value = '';
    document.getElementById('company-address').value = '';
    document.getElementById('company-phone').value = '';
    document.getElementById('company-mobile').value = '';
    document.getElementById('company-website').value = '';
    
    // Reset logo to default
    document.getElementById('company-logo').src = 'assets/default-logo.png';
    
    // Clear client info
    document.getElementById('client-name').value = '';
    document.getElementById('client-contact').value = '';
    document.getElementById('client-address').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-email').value = '';
    
    // Clear invoice details
    document.getElementById('invoice-number').value = '';
    document.getElementById('invoice-date').value = '';
    document.getElementById('payment-due').value = '';
    
    // Clear items
    document.getElementById('item-rows').innerHTML = '';
    
    // Reset calculations
    document.getElementById('subtotal').textContent = '0.00';
    document.getElementById('discount').value = '0';
    document.getElementById('discount-type').value = 'fixed';
    document.getElementById('discount-amount').textContent = '0.00';
    document.getElementById('total-amount').textContent = '0.00';
    
    // Clear notes/terms
    document.getElementById('payment-methods').value = '';
    document.getElementById('notes').value = '';
    
    // Clear preview
    document.getElementById('preview-content').innerHTML = '';
}

function checkForSavedDraft(storageManager) {
    if (storageManager.hasSavedDraft()) {
        if (confirm('A saved draft was found. Would you like to load it?')) {
            const savedDraft = storageManager.loadDraft();
            const invoiceManager = new InvoiceManager();
            invoiceManager.populateFormWithData(savedDraft);
            updateCalculations();
        }
    }
}