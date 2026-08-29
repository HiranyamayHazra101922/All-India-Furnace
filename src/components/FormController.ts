import { appStore } from '../state/store';
import { QuotationState } from '../types';

export class FormController {
  private refNoInput = document.getElementById('field-refNo') as HTMLInputElement;
  private dateInput = document.getElementById('field-date') as HTMLInputElement;
  private clientInput = document.getElementById('field-client') as HTMLTextAreaElement;
  private subjectInput = document.getElementById('field-subject') as HTMLInputElement;
  private sizeInput = document.getElementById('field-size') as HTMLInputElement;
  private costInput = document.getElementById('field-cost') as HTMLInputElement;
  private costWordsInput = document.getElementById('field-costWords') as HTMLInputElement;
  private deliveryInput = document.getElementById('field-delivery') as HTMLInputElement;
  private paymentInput = document.getElementById('field-payment') as HTMLTextAreaElement;
  private blankLetterheadInput = document.getElementById('field-blankLetterhead') as HTMLInputElement;

  constructor() {
    this.bindEvents();
    appStore.subscribe((state) => this.hydrate(state));
  }

  private bindEvents() {
    this.refNoInput.addEventListener('input', () => appStore.setState({ refNo: this.refNoInput.value }));
    this.dateInput.addEventListener('input', () => appStore.setState({ date: this.dateInput.value }));
    this.clientInput.addEventListener('input', () => appStore.setState({ clientDetails: this.clientInput.value }));
    this.subjectInput.addEventListener('input', () => appStore.setState({ subject: this.subjectInput.value }));
    this.sizeInput.addEventListener('input', () => appStore.setState({ sizeSpecification: this.sizeInput.value }));
    
    this.costInput.addEventListener('input', () => {
      const val = parseFloat(this.costInput.value) || 0;
      appStore.setState({ totalCost: val });
    });

    this.deliveryInput.addEventListener('input', () => appStore.setState({ deliveryTerms: this.deliveryInput.value }));
    this.paymentInput.addEventListener('input', () => appStore.setState({ paymentTerms: this.paymentInput.value }));
    this.blankLetterheadInput.addEventListener('change', () => {
      appStore.setState({ blankLetterheadMode: this.blankLetterheadInput.checked });
    });
  }

  private hydrate(state: QuotationState) {
    if (document.activeElement !== this.refNoInput) this.refNoInput.value = state.refNo;
    if (document.activeElement !== this.dateInput) this.dateInput.value = state.date;
    if (document.activeElement !== this.clientInput) this.clientInput.value = state.clientDetails;
    if (document.activeElement !== this.subjectInput) this.subjectInput.value = state.subject;
    if (document.activeElement !== this.sizeInput) this.sizeInput.value = state.sizeSpecification;
    if (document.activeElement !== this.costInput) this.costInput.value = String(state.totalCost);
    this.costWordsInput.value = state.costInWords;
    if (document.activeElement !== this.deliveryInput) this.deliveryInput.value = state.deliveryTerms;
    if (document.activeElement !== this.paymentInput) this.paymentInput.value = state.paymentTerms;
    this.blankLetterheadInput.checked = state.blankLetterheadMode;
  }
}