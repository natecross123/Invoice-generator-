// Main application entry point
import { InvoiceManager } from './invoice.js';
import { PDFGenerator } from './pdf-generator.js';
import { StorageManager } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    const invoiceManager = new InvoiceManager();
    const pdfGenerator = new PDFGenerator();
    const storageManager = new StorageManager();
    
    // Initialize form with defaults
    initializeDefaults();
    
    // Add first item row
    addItemRow();
    
    // Setup event listeners
    setupEventListeners(invoiceManager, pdfGenerator, storageManager);
    
    // Auto-update preview as user types
    setupAutoPreview(invoiceManager);
    
    // Check for saved draft
    checkForSavedDraft(storageManager, invoiceManager);
});

function initializeDefaults() {
    // Set today's date as default for invoice date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    // Set default due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('payment-due').value = dueDate.toISOString().split('T')[0];
    
    // Generate default invoice number
    document.getElementById('invoice-number').value = generateInvoiceNumber();
    
    // Set default payment methods
    document.getElementById('payment-methods').value = 'Bank transfer, Credit card, Cash';
    document.getElementById('notes').value = 'Thank you for your business!';
}

function setupEventListeners(invoiceManager, pdfGenerator, storageManager) {
    // Logo upload
    const logoUploadBtn = document.getElementById('upload-logo-btn');
    const logoInput = document.getElementById('logo-upload');
    
    logoUploadBtn.addEventListener('click', () => logoInput.click());
    logoInput.addEventListener('change', handleLogoUpload);
    
    // Item management
    document.getElementById('add-item').addEventListener('click', addItemRow);
    
    // Event delegation for dynamic item elements
    document.getElementById('items-table').addEventListener('click', handleItemActions);
    document.getElementById('items-table').addEventListener('input', handleItemInput);
    
    // Discount changes
    ['input', 'change'].forEach(event => {
        document.getElementById('discount').addEventListener(event, updateCalculations);
        document.getElementById('discount-type').addEventListener(event, updateCalculations);
    });
    
    // Main action buttons
    setupMainActions(invoiceManager, pdfGenerator, storageManager);
}

function setupMainActions(invoiceManager, pdfGenerator, storageManager) {
    // Preview button
    document.getElementById('preview-invoice').addEventListener('click', () => {
        generatePreview(invoiceManager);
    });
    
    // Download PDF button
    document.getElementById('download-pdf').addEventListener('click', async () => {
        await handlePDFDownload(invoiceManager, pdfGenerator);
    });
    
    // Save draft button
    document.getElementById('save-draft').addEventListener('click', () => {
        const invoiceData = invoiceManager.collectFormData();
        if (storageManager.saveDraft(invoiceData)) {
            showNotification('✅ Draft saved successfully!', 'success');
        } else {
            showNotification('❌ Failed to save draft', 'error');
        }
    });
    
    // Load draft button
    document.getElementById('load-draft').addEventListener('click', () => {
        const savedDraft = storageManager.loadDraft();
        if (savedDraft) {
            invoiceManager.populateFormWithData(savedDraft);
            updateCalculations();
            generatePreview(invoiceManager);
            showNotification('✅ Draft loaded successfully!', 'success');
        } else {
            showNotification('ℹ️ No saved draft found', 'info');
        }
    });
    
    // New invoice button
    document.getElementById('new-invoice').addEventListener('click', () => {
        if (confirm('Create a new invoice? Unsaved changes will be lost.')) {
            clearForm();
            initializeDefaults();
            addItemRow();
            updateCalculations();
            showNotification('📄 New invoice created', 'info');
        }
    });
}

function setupAutoPreview(invoiceManager) {
    // Auto-update preview on form changes
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        ['input', 'change'].forEach(event => {
            input.addEventListener(event, debounce(() => {
                generatePreview(invoiceManager);
            }, 500));
        });
    });
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
        // Check file size (limit to 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('⚠️ Image too large. Please use an image under 2MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('company-logo').src = event.target.result;
            generatePreview(new InvoiceManager());
        };
        reader.readAsDataURL(file);
    }
}

function addItemRow() {
    const tbody = document.getElementById('item-rows');
    const template = document.getElementById('item-row-template');
    const clone = document.importNode(template.content, true);
    
    tbody.appendChild(clone);
    
    // Focus on the description field of the new row
    const newRow = tbody.lastElementChild;
    const descriptionInput = newRow.querySelector('.item-description');
    if (descriptionInput) {
        setTimeout(() => descriptionInput.focus(), 100);
    }
    
    updateCalculations();
}

function handleItemActions(e) {
    if (e.target.classList.contains('delete-item')) {
        deleteItemRow(e.target.closest('tr'));
        updateCalculations();
        generatePreview(new InvoiceManager());
    }
}

function handleItemInput(e) {
    if (e.target.classList.contains('item-quantity') || 
        e.target.classList.contains('item-price')) {
        updateRowAmount(e.target.closest('tr'));
        updateCalculations();
        generatePreview(new InvoiceManager());
    }
}

function deleteItemRow(row) {
    const rows = document.querySelectorAll('#item-rows tr');
    if (rows.length > 1) {
        row.remove();
    } else {
        // Clear the last row instead of removing it
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = input.classList.contains('item-quantity') ? '1' : '0.00';
            } else {
                input.value = '';
            }
        });
        row.querySelector('.item-amount').textContent = '0.00';
    }
}

function updateRowAmount(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const amount = quantity * price;
    
    row.querySelector('.item-amount').textContent = formatCurrency(amount);
}

function updateCalculations() {
    let subtotal = 0;
    
    // Calculate subtotal from all items
    document.querySelectorAll('.item-row').forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = quantity * price;
        subtotal += amount;
        row.querySelector('.item-amount').textContent = formatCurrency(amount);
    });
    
    // Update subtotal display
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    
    // Calculate discount
    const discountValue = parseFloat(document.getElementById('discount').value) || 0;
    const discountType = document.getElementById('discount-type').value;
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
        discountAmount = (subtotal * (discountValue / 100));
    } else {
        discountAmount = discountValue;
    }
    
    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    
    // Update displays
    document.getElementById('discount-amount').textContent = formatCurrency(discountAmount);
    const total = Math.max(0, subtotal - discountAmount);
    document.getElementById('total-amount').textContent = formatCurrency(total);
}

function generatePreview(invoiceManager) {
    try {
        const invoiceData = invoiceManager.collectFormData();
        const previewHtml = invoiceManager.generateInvoiceHTML(invoiceData);
        document.getElementById('preview-content').innerHTML = previewHtml;
    } catch (error) {
        console.error('Preview generation error:', error);
        document.getElementById('preview-content').innerHTML = `
            <div class="empty-preview">
                <p>⚠️ Error generating preview</p>
            </div>
        `;
    }
}

async function handlePDFDownload(invoiceManager, pdfGenerator) {
    const loadingOverlay = document.getElementById('loading-overlay');
    
    try {
        // Validate required fields
        const requiredFields = ['company-name', 'client-name', 'invoice-number'];
        const missingFields = [];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                missingFields.push(field.previousElementSibling.textContent.replace(' *', ''));
            }
        });
        
        if (missingFields.length > 0) {
            showNotification(`❌ Please fill in: ${missingFields.join(', ')}`, 'error');
            return;
        }
        
        // Check if there are any items
        const hasItems = Array.from(document.querySelectorAll('.item-description')).some(input => input.value.trim());
        if (!hasItems) {
            showNotification('❌ Please add at least one item', 'error');
            return;
        }
        
        loadingOverlay.classList.remove('hidden');
        
        // Generate preview first to ensure it's up to date
        generatePreview(invoiceManager);
        
        // Small delay to ensure preview is rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const invoiceData = invoiceManager.collectFormData();
        const filename = await pdfGenerator.generatePDF(invoiceData);
        
        showNotification(`✅ PDF generated: ${filename}`, 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('❌ Error generating PDF. Please try again.', 'error');
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${randomDigits}`;
}

function formatCurrency(amount) {
    return amount.toFixed(2);
}

function clearForm() {
    // Clear all form inputs
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type === 'date') {
            input.value = '';
        } else if (input.type === 'number') {
            input.value = input.classList.contains('item-quantity') ? '1' : '0';
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });
    
    // Reset logo
    document.getElementById('company-logo').src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4=';
    
    // Clear items table
    document.getElementById('item-rows').innerHTML = '';
    
    // Reset calculations
    ['subtotal', 'discount-amount', 'total-amount'].forEach(id => {
        document.getElementById(id).textContent = '0.00';
    });
    
    // Clear preview
    document.getElementById('preview-content').innerHTML = `
        <div class="empty-preview">
            <p>👆 Fill in the form to see your invoice preview</p>
        </div>
    `;
}

function checkForSavedDraft(storageManager, invoiceManager) {
    if (storageManager.hasSavedDraft()) {
        const timestamp = storageManager.getDraftTimestamp();
        const timeStr = timestamp ? timestamp.toLocaleString() : 'Unknown time';
        
        if (confirm(`Found a saved draft from ${timeStr}. Load it?`)) {
            const savedDraft = storageManager.loadDraft();
            invoiceManager.populateFormWithData(savedDraft);
            updateCalculations();
            generatePreview(invoiceManager);
            showNotification('✅ Draft loaded successfully!', 'success');
        }
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}