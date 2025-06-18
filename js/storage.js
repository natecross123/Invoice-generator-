// Local storage management for invoice drafts
export class StorageManager {
    constructor() {
        this.storageKey = 'invoice_generator_draft';
    }
    
    saveDraft(invoiceData) {
        try {
            // Handle logo storage (convert from data URL if needed)
            if (invoiceData.company.logoUrl && invoiceData.company.logoUrl.startsWith('data:')) {
                // We need to store the data URL of the image
                // Note: This can be large for high-res images, which might exceed storage limits
                // A more robust solution would use IndexedDB for larger files
            }
            
            // Convert data to JSON string
            const jsonData = JSON.stringify(invoiceData);
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, jsonData);
            
            // Also save timestamp
            localStorage.setItem(`${this.storageKey}_timestamp`, new Date().toISOString());
            
            return true;
        } catch (error) {
            console.error('Error saving draft:', error);
            
            // If error is due to exceeded quota, inform user
            if (error.name === 'QuotaExceededError' || 
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert('Storage quota exceeded. The logo image may be too large. Try using a smaller image.');
            }
            
            return false;
        }
    }
    
    loadDraft() {
        try {
            const jsonData = localStorage.getItem(this.storageKey);
            
            if (!jsonData) {
                return null;
            }
            
            // Parse the saved data
            const invoiceData = JSON.parse(jsonData);
            
            return invoiceData;
        } catch (error) {
            console.error('Error loading draft:', error);
            return null;
        }
    }
    
    hasSavedDraft() {
        return localStorage.getItem(this.storageKey) !== null;
    }
    
    getDraftTimestamp() {
        const timestamp = localStorage.getItem(`${this.storageKey}_timestamp`);
        return timestamp ? new Date(timestamp) : null;
    }
    
    clearDraft() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(`${this.storageKey}_timestamp`);
    }
    
    exportData() {
        const invoiceData = this.loadDraft();
        
        if (!invoiceData) {
            return null;
        }
        
        // Create a downloadable JSON file
        const jsonString = JSON.stringify(invoiceData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create a link element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoiceData.invoice.number || 'draft'}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    }
    
    importData(jsonFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    this.saveDraft(jsonData);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsText(jsonFile);
        });
    }
}