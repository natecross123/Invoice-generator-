// Invoice data handling and HTML generation
export class InvoiceManager {
    constructor() {
        this.currencySymbols = {
            'JMD': 'J$',
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        };
    }
    
    collectFormData() {
        // Company information
        const companyData = {
            name: document.getElementById('company-name').value,
            trn: document.getElementById('company-trn').value,
            address: document.getElementById('company-address').value,
            phone: document.getElementById('company-phone').value,
            mobile: document.getElementById('company-mobile').value,
            website: document.getElementById('company-website').value,
            logoUrl: document.getElementById('company-logo').src
        };
        
        // Client information
        const clientData = {
            name: document.getElementById('client-name').value,
            contact: document.getElementById('client-contact').value,
            address: document.getElementById('client-address').value,
            phone: document.getElementById('client-phone').value,
            email: document.getElementById('client-email').value
        };
        
        // Invoice details
        const invoiceDetails = {
            number: document.getElementById('invoice-number').value,
            date: document.getElementById('invoice-date').value,
            dueDate: document.getElementById('payment-due').value,
            currency: document.getElementById('currency').value,
            currencySymbol: this.currencySymbols[document.getElementById('currency').value] || ''
        };
        
        // Invoice items
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            items.push({
                code: row.querySelector('.item-code').value,
                description: row.querySelector('.item-description').value,
                quantity: parseFloat(row.querySelector('.item-quantity').value) || 0,
                price: parseFloat(row.querySelector('.item-price').value) || 0,
                amount: parseFloat(row.querySelector('.item-quantity').value || 0) * 
                         parseFloat(row.querySelector('.item-price').value || 0)
            });
        });
        
        // Calculations
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const discountValue = parseFloat(document.getElementById('discount').value) || 0;
        const discountType = document.getElementById('discount-type').value;
        
        let discountAmount = 0;
        if (discountType === 'percentage') {
            discountAmount = (subtotal * (discountValue / 100));
        } else { // fixed
            discountAmount = discountValue;
        }
        
        const total = subtotal - discountAmount;
        
        // Payment and notes
        const paymentMethods = document.getElementById('payment-methods').value;
        const notes = document.getElementById('notes').value;
        
        // Compile all data
        return {
            company: companyData,
            client: clientData,
            invoice: invoiceDetails,
            items: items,
            calculations: {
                subtotal,
                discountValue,
                discountType,
                discountAmount,
                total
            },
            paymentMethods,
            notes
        };
    }
    
    populateFormWithData(data) {
        // Populate company info
        document.getElementById('company-name').value = data.company.name || '';
        document.getElementById('company-trn').value = data.company.trn || '';
        document.getElementById('company-address').value = data.company.address || '';
        document.getElementById('company-phone').value = data.company.phone || '';
        document.getElementById('company-mobile').value = data.company.mobile || '';
        document.getElementById('company-website').value = data.company.website || '';
        
        // Set logo if available
        if (data.company.logoUrl && data.company.logoUrl !== 'assets/default-logo.png') {
            document.getElementById('company-logo').src = data.company.logoUrl;
        }
        
        // Populate client info
        document.getElementById('client-name').value = data.client.name || '';
        document.getElementById('client-contact').value = data.client.contact || '';
        document.getElementById('client-address').value = data.client.address || '';
        document.getElementById('client-phone').value = data.client.phone || '';
        document.getElementById('client-email').value = data.client.email || '';
        
        // Populate invoice details
        document.getElementById('invoice-number').value = data.invoice.number || '';
        document.getElementById('invoice-date').value = data.invoice.date || '';
        document.getElementById('payment-due').value = data.invoice.dueDate || '';
        document.getElementById('currency').value = data.invoice.currency || 'JMD';
        
        // Clear existing items
        document.getElementById('item-rows').innerHTML = '';
        
        // Add items
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                this.addItemWithData(item);
            });
        } else {
            // Add at least one empty row
            this.addEmptyItem();
        }
        
        // Set discount
        document.getElementById('discount').value = data.calculations.discountValue || 0;
        document.getElementById('discount-type').value = data.calculations.discountType || 'fixed';
        
        // Set payment methods and notes
        document.getElementById('payment-methods').value = data.paymentMethods || '';
        document.getElementById('notes').value = data.notes || '';
    }
    
    addItemWithData(itemData) {
        const tbody = document.getElementById('item-rows');
        const template = document.getElementById('item-row-template');
        const clone = document.importNode(template.content, true);
        
        const row = clone.querySelector('.item-row');
        
        row.querySelector('.item-code').value = itemData.code || '';
        row.querySelector('.item-description').value = itemData.description || '';
        row.querySelector('.item-quantity').value = itemData.quantity || 0;
        row.querySelector('.item-price').value = itemData.price || 0;
        row.querySelector('.item-amount').textContent = itemData.amount.toFixed(2);
        
        tbody.appendChild(clone);
    }
    
    addEmptyItem() {
        const tbody = document.getElementById('item-rows');
        const template = document.getElementById('item-row-template');
        const clone = document.importNode(template.content, true);
        tbody.appendChild(clone);
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    formatCurrency(amount, currencySymbol = 'J$') {
        return `${currencySymbol}${amount.toFixed(2)}`;
    }
    
    generateInvoiceHTML(data) {
        const { company, client, invoice, items, calculations, paymentMethods, notes } = data;
        
        // Format dates
        const formattedInvoiceDate = this.formatDate(invoice.date);
        const formattedDueDate = this.formatDate(invoice.dueDate);
        
        // Create invoice HTML
        let html = `
            <div class="invoice-header">
                <div class="invoice-title">INVOICE</div>
                <div class="trn-number">TRN: ${company.trn}</div>
            </div>
            
            <div class="company-info">
                <div class="company-logo">
                    <img src="${company.logoUrl}" alt="${company.name} Logo">
                </div>
                
                <div class="company-details">
                    <div class="company-name">${company.name}</div>
                    <div class="company-address">${company.address.replace(/\n/g, '<br>')}</div>
                    <div class="company-contacts">
                        ${company.phone ? `<div>Phone: ${company.phone}</div>` : ''}
                        ${company.mobile ? `<div>Mobile: ${company.mobile}</div>` : ''}
                        ${company.website ? `<div>${company.website}</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="invoice-info">
                <div class="bill-to-section">
                    <div class="bill-to-title">BILL TO</div>
                    <div class="client-name">${client.name}</div>
                    ${client.contact ? `<div>${client.contact}</div>` : ''}
                    ${client.address ? `<div>${client.address.replace(/\n/g, '<br>')}</div>` : ''}
                    ${client.phone ? `<div>${client.phone}</div>` : ''}
                    ${client.email ? `<div>${client.email}</div>` : ''}
                </div>
                
                <div class="invoice-details-section">
                    <div class="invoice-info-row">
                        <div class="label">Invoice Number:</div>
                        <div class="value">${invoice.number}</div>
                    </div>
                    <div class="invoice-info-row">
                        <div class="label">Invoice Date:</div>
                        <div class="value">${formattedInvoiceDate}</div>
                    </div>
                    <div class="invoice-info-row">
                        <div class="label">Payment Due:</div>
                        <div class="value">${formattedDueDate}</div>
                    </div>
                    <div class="invoice-info-row">
                        <div class="label">Amount Due (${invoice.currency}):</div>
                        <div class="value">${this.formatCurrency(calculations.total, invoice.currencySymbol)}</div>
                    </div>
                </div>
            </div>
            
            <div class="invoice-items-section">
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Items</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th class="amount-column">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add item rows
        items.forEach(item => {
            html += `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatCurrency(item.price, invoice.currencySymbol)}</td>
                    <td class="amount-column">${this.formatCurrency(item.amount, invoice.currencySymbol)}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
                
                <div class="invoice-totals">
                    <div class="total-row">
                        <div class="label">Subtotal:</div>
                        <div class="value">${this.formatCurrency(calculations.subtotal, invoice.currencySymbol)}</div>
                    </div>
        `;
        
        // Add discount if applicable
        if (calculations.discountAmount > 0) {
            const discountLabel = calculations.discountType === 'percentage' 
                ? `Discount (${calculations.discountValue}%):`
                : 'Discount:';
                
            html += `
                <div class="total-row">
                    <div class="label">${discountLabel}</div>
                    <div class="value">(${this.formatCurrency(calculations.discountAmount, invoice.currencySymbol)})</div>
                </div>
            `;
        }
        
        html += `
                    <div class="total-row grand-total">
                        <div class="label">Total:</div>
                        <div class="value">${this.formatCurrency(calculations.total, invoice.currencySymbol)}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add payment info and notes
        if (paymentMethods || notes) {
            html += `
                <div class="payment-info">
                    <div class="payment-title">Notes / Terms</div>
            `;
            
            if (paymentMethods) {
                html += `
                    <div class="payment-methods">
                        <div class="payment-label">Payment methods:</div>
                        <div class="payment-text">${paymentMethods.replace(/\n/g, '<br>')}</div>
                    </div>
                `;
            }
            
            if (notes) {
                html += `
                    <div class="additional-notes">
                        ${notes.replace(/\n/g, '<br>')}
                    </div>
                `;
            }
            
            html += `</div>`;
        }
        
        // Add footer
        html += `
            <div class="invoice-footer">
                <div>Thank you for choosing ${company.name}!</div>
                ${company.website ? `<div>${company.website}</div>` : ''}
                <div>Page 1 of 1 for Invoice #${invoice.number}</div>
            </div>
        `;
        
        return html;
    }
}