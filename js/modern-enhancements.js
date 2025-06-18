// Modern UI enhancements for the invoice generator
// Import this file in your index.html after app.js

document.addEventListener('DOMContentLoaded', function() {
    modernizeUI();
});

function modernizeUI() {
    // Add icons to buttons
    enhanceButtons();
    
    // Add hover effects
    addHoverEffects();
    
    // Improve form validation
    enhanceFormValidation();
    
    // Add animations
    addAnimations();
    
    // Enhance Add Item button
    enhanceAddItemButton();
}

function enhanceButtons() {
    // New Invoice button
    const newInvoiceBtn = document.getElementById('new-invoice');
    if (newInvoiceBtn) {
        newInvoiceBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg> New Invoice';
    }
    
    // Save Draft button
    const saveDraftBtn = document.getElementById('save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Draft';
    }
    
    // Load Draft button
    const loadDraftBtn = document.getElementById('load-draft');
    if (loadDraftBtn) {
        loadDraftBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Load Draft';
    }
    
    // Preview button
    const previewBtn = document.getElementById('preview-invoice');
    if (previewBtn) {
        previewBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview';
    }
    
    // Download PDF button
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download PDF';
    }
    
    // Upload Logo button
    const uploadLogoBtn = document.getElementById('upload-logo-btn');
    if (uploadLogoBtn) {
        uploadLogoBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Upload Logo';
    }

    // Style all buttons to have flex layout for icon alignment
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => {
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '6px';
    });
}

function addHoverEffects() {
    // Add hover effect to logo upload
    const logoPreview = document.getElementById('logo-preview');
    if (logoPreview) {
        logoPreview.innerHTML += '<div class="logo-hover-overlay"><span>Change Logo</span></div>';
        
        // Add CSS for hover effect
        const style = document.createElement('style');
        style.textContent = `
            .logo-hover-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s ease;
                border-radius: 6px;
            }
            #logo-preview {
                position: relative;
            }
            #logo-preview:hover .logo-hover-overlay {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

function enhanceFormValidation() {
    // Add required attribute to important fields
    const requiredFields = [
        'company-name',
        'client-name',
        'invoice-number',
        'invoice-date',
        'payment-due'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.setAttribute('required', 'required');
        }
    });
    
    // Add input validation for numeric fields
    const priceInputs = document.querySelectorAll('.item-price');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
    
    // Improve mobile number validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.setAttribute('pattern', '[0-9+\\-\\s()]*');
        input.setAttribute('title', 'Please enter a valid phone number');
    });
}

function addAnimations() {
    // Add smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        .form-group, .logo-upload, section, .invoice-preview {
            transition: all 0.3s ease;
        }
        
        /* Fade in animation for new items */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .item-row {
            animation: fadeIn 0.3s ease forwards;
        }
        
        /* Pulse animation for the preview button */
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        
        .btn-primary:focus {
            animation: pulse 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
}

function enhanceAddItemButton() {
    const addItemBtn = document.getElementById('add-item');
    if (addItemBtn) {
        // Update the button appearance
        addItemBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add New Item';
        
        // Improve the appearance and animation
        const style = document.createElement('style');
        style.textContent = `
            #add-item {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
                background-color: #f9fafb;
                border: 1px dashed #d1d5db;
                color: #6366f1;
                padding: 12px;
                font-weight: 500;
            }
            
            #add-item:hover {
                background-color: #f3f4f6;
                border-color: #6366f1;
            }
            
            #add-item:active {
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);
    }
}

// Add tooltip functionality
function addTooltips() {
    const tooltips = [
        { element: 'company-name', text: 'Enter your company or business name' },
        { element: 'company-trn', text: 'Tax Registration Number' },
        { element: 'invoice-number', text: 'A unique identifier for this invoice' },
        { element: 'discount', text: 'Apply a discount to the total amount' }
    ];
    
    tooltips.forEach(tooltip => {
        const element = document.getElementById(tooltip.element);
        if (element) {
            element.setAttribute('title', tooltip.text);
        }
    });
}

// Initialize tooltips after the page loads
document.addEventListener('DOMContentLoaded', function() {
    addTooltips();
});