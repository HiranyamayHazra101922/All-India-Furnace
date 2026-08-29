import './style.css';
import { FormController } from './components/FormController';
import { DragDropPool } from './components/DragDropPool';
import { PreviewRenderer } from './components/PreviewRenderer';
import { generateWordDocument } from './export/docxGenerator';
import { generatePdfDocument } from './export/pdfGenerator';
import { appStore } from './state/store';

// Initialize Components
new FormController();
new DragDropPool();
new PreviewRenderer();

const formatSelector = document.getElementById('export-format-selector') as HTMLSelectElement;
const exportBtn = document.getElementById('btn-export-file') as HTMLButtonElement;
const exportText = document.getElementById('export-button-text') as HTMLElement;

formatSelector?.addEventListener('change', () => {
  exportText.innerText = formatSelector.value === 'docx' ? 'Download Word' : 'Download PDF';
});

exportBtn?.addEventListener('click', () => {
  const state = appStore.getState();
  if (formatSelector.value === 'docx') {
    generateWordDocument(state);
  } else {
    generatePdfDocument(state);
  }
});

document.getElementById('btn-print')?.addEventListener('click', () => {
  window.print();
});

// Zoom & Responsive Fit Management
const scaleWrapper = document.getElementById('preview-scale-wrapper') as HTMLElement;
const zoomText = document.getElementById('zoom-level-text') as HTMLElement;
let currentZoom = 1.0;

function applyZoom(zoom: number) {
  currentZoom = Math.min(Math.max(zoom, 0.4), 1.5);
  if (scaleWrapper) {
    scaleWrapper.style.transform = `scale(${currentZoom})`;
  }
  if (zoomText) {
    zoomText.innerText = `${Math.round(currentZoom * 100)}%`;
  }
}

document.getElementById('btn-zoom-in')?.addEventListener('click', () => applyZoom(currentZoom + 0.1));
document.getElementById('btn-zoom-out')?.addEventListener('click', () => applyZoom(currentZoom - 0.1));

document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
  const parentContainer = scaleWrapper?.parentElement;
  if (parentContainer) {
    const availableWidth = parentContainer.clientWidth - 32;
    const a4WidthPx = 794; // Standard 210mm at 96 DPI
    if (availableWidth < a4WidthPx) {
      applyZoom(availableWidth / a4WidthPx);
    } else {
      applyZoom(1.0);
    }
  }
});

// Auto fit on initial load or resize
window.addEventListener('resize', () => {
  const parentContainer = scaleWrapper?.parentElement;
  if (parentContainer && parentContainer.clientWidth < 820) {
    const availableWidth = parentContainer.clientWidth - 32;
    applyZoom(availableWidth / 794);
  }
});

// Trigger initial fit check
setTimeout(() => {
  const parentContainer = scaleWrapper?.parentElement;
  if (parentContainer && parentContainer.clientWidth < 820) {
    applyZoom((parentContainer.clientWidth - 32) / 794);
  }
}, 100);