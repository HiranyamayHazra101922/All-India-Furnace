// @ts-ignore
import html2pdf from 'html2pdf.js';
import { QuotationState } from '../types';

export function generatePdfDocument(state: QuotationState): void {
  const element = document.getElementById('print-area');
  if (!element) return;

  // Clone the node so we can remove underlines for PDF only without affecting the UI
  const clonedElement = element.cloneNode(true) as HTMLElement;

  // Remove all underlines inside the cloned element
  const underlinedElements = clonedElement.querySelectorAll('.underline');
  underlinedElements.forEach((el) => {
    el.classList.remove('underline');
    (el as HTMLElement).style.textDecoration = 'none';
  });

  const opt = {
    margin: 0,
    filename: `Quotation_${state.refNo.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 1.0 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const
    },
    pagebreak: { mode: 'avoid-all' }
  };

  html2pdf().set(opt).from(clonedElement).save();
}