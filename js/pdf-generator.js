// PDF generation functionality
export class PDFGenerator {
    constructor() {
        this.paperSize = {
            width: 210, // A4 width in mm
            height: 297 // A4 height in mm
        };
    }
    
    async generatePDF(invoiceData) {
        // Ensure libraries are loaded
        if (typeof jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
            throw new Error('Required libraries (jsPDF, html2canvas) are not loaded');
        }
        
        try {
            // Get the preview content
            const previewElement = document.getElementById('preview-content');
            
            // Create a deep clone of the preview to avoid modifying the original
            const clonedPreview = previewElement.cloneNode(true);
            
            // Apply print-specific styling to clone
            clonedPreview.classList.add('pdf-mode');
            
            // Temporarily append to document for rendering
            clonedPreview.style.position = 'absolute';
            clonedPreview.style.left = '-9999px';
            document.body.appendChild(clonedPreview);
            
            // Capture HTML content as canvas
            const canvas = await html2canvas(clonedPreview, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Allow loading of external images (like logos)
                logging: false,
                backgroundColor: '#FFFFFF'
            });
            
            // Remove temporary element
            document.body.removeChild(clonedPreview);
            
            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Calculate dimensions to maintain aspect ratio
            const imgWidth = this.paperSize.width - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add canvas as image to PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            
            // Check if content needs multiple pages
            if (imgHeight > this.paperSize.height - 20) {
                const pageCount = Math.ceil(imgHeight / (this.paperSize.height - 20));
                
                // Remove the first page that was automatically added
                pdf.deletePage(1);
                
                // Split content across multiple pages
                for (let i = 0; i < pageCount; i++) {
                    // Add new page
                    pdf.addPage();
                    
                    // Calculate source position in the canvas
                    const sourceY = i * canvas.height / pageCount;
                    const sourceHeight = canvas.height / pageCount;
                    
                    // Add portion of image to this page
                    pdf.addImage(
                        imgData, 
                        'PNG', 
                        10, // x position
                        10, // y position
                        imgWidth, 
                        imgHeight / pageCount,
                        '', // alias
                        'FAST', // compression
                        0, // rotation
                        sourceY / canvas.height, // source x
                        0, // source y
                        1 / pageCount, // source width (as percentage)
                        1 // source height (as percentage)
                    );
                    
                    // Add page number
                    pdf.setFontSize(8);
                    pdf.setTextColor(100);
                    pdf.text(`Page ${i + 1} of ${pageCount} for Invoice #${invoiceData.invoice.number}`,
                          this.paperSize.width / 2, this.paperSize.height - 10, {
                              align: 'center'
                          });
                }
            }
            
            // Generate filename
            const filename = `Invoice_${invoiceData.invoice.number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            
            // Save PDF
            pdf.save(filename);
            
            return filename;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }
}