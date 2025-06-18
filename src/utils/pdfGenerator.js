import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (element, filename = 'invoice') => {
  try {
    // Hide print-only elements and show all content
    const printElements = element.querySelectorAll('.print\\:hidden')
    printElements.forEach(el => el.style.display = 'none')

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in cloned document
        const clonedElement = clonedDoc.querySelector('[data-html2canvas-ignore]')
        if (clonedElement) {
          clonedElement.style.display = 'none'
        }
      }
    })

    // Restore hidden elements
    printElements.forEach(el => el.style.display = '')

    const imgData = canvas.toDataURL('image/png')
    
    // Calculate PDF dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
    return false
  }
}

export const generatePDFBlob = async (element) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    
    return pdf.output('blob')
  } catch (error) {
    console.error('Error generating PDF blob:', error)
    return null
  }
}