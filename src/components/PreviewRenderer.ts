import { appStore } from '../state/store';
import { QuotationState } from '../types';

export class PreviewRenderer {
  constructor() {
    appStore.subscribe((state) => this.render(state));
  }

  private render(state: QuotationState) {
    (document.getElementById('pv-refNo') as HTMLElement).innerText = state.refNo;
    (document.getElementById('pv-date') as HTMLElement).innerText = state.date;
    (document.getElementById('pv-client') as HTMLElement).innerText = state.clientDetails;
    (document.getElementById('pv-subject') as HTMLElement).innerText = `Sub : ${state.subject}`;
    (document.getElementById('pv-size') as HTMLElement).innerText = state.sizeSpecification;

    (document.getElementById('pv-costNum') as HTMLElement).innerText = state.totalCost.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    (document.getElementById('pv-costWords') as HTMLElement).innerText = state.costInWords;
    (document.getElementById('pv-delivery') as HTMLElement).innerText = state.deliveryTerms;
    (document.getElementById('pv-payment') as HTMLElement).innerText = state.paymentTerms;

    // Render columns
    this.renderNumberedList('pv-material-list', state.materials);
    this.renderNumberedList('pv-body-list', state.body);
    this.renderNumberedList('pv-panel-list', state.panel);

    // Letterhead visibility handling
    const header = document.getElementById('pv-header');
    const spacer = document.getElementById('pv-header-spacer');
    if (state.blankLetterheadMode) {
      header?.classList.add('hide-letterhead');
      spacer?.classList.remove('hidden');
    } else {
      header?.classList.remove('hide-letterhead');
      spacer?.classList.add('hidden');
    }
  }

  private renderNumberedList(elementId: string, items: string[]) {
    const container = document.getElementById(elementId) as HTMLElement;
    container.innerHTML = items
      .map((item, idx) => `
        <div class="flex">
          <span class="w-5 text-slate-500 font-mono">${String(idx + 1).padStart(2, '0')})</span>
          <span>${item}</span>
        </div>
      `)
      .join('');
  }
}