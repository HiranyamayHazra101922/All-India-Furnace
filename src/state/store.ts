import { QuotationState } from '../types';
import { convertToIndianCurrencyWords } from '../utils/numberToWords';

const STORAGE_KEY = 'aifc_quote_state_v1';

const defaultState: QuotationState = {
  refNo: 'AIFC/05/2026-27',
  date: '28.08.2026',
  clientDetails: 'M/s. Pair Techno Solutions Private Limited,\n147, Nilgunge Road, Belghoria,\nKolkata-700056',
  subject: 'Quotation for Round type Electric Furnace',
  sizeSpecification: 'Size: Height-66" x Round-76"',
  materials: [
    "Brick Cold Face", "Hot Bricks", "Ceramic Board", "Blanket", 
    "Sector", "Key", "ACC-50 Cement", "Element Control A-1", 
    "Sodium Socket", "Bas Bar", "Porcelene Tube"
  ],
  body: [
    "M.S. Sheet", "M.S. Angle", "M.S. Pati", "Top Plate", 
    "Door Arrangement", "Nut/Bolt/Washer", "Labour charges", "Revolving Wheel"
  ],
  panel: [
    "M.S.Panel Box Body", "Amp. Meter", "Volt Meter", "Digital Meter", 
    "Indicating Lamp", "Toggle Switch", "Thermo couple SS:310", 
    "Compensating Cable", "SS Nut, Bolt & Washer", "Connecting Pol", 
    "Panel Wiring Wire", "Labour charges"
  ],
  totalCost: 476900,
  costInWords: 'Rupees Four Lakh Seventy Six Thousand Nine Hundred only',
  deliveryTerms: 'After 35 days from the receipt your order copy',
  paymentTerms: 'a) 50% advance.\nb) 25% payment within working period\nc) Balance 25% after completion of Job.',
  blankLetterheadMode: false
};

class Store {
  private state: QuotationState;
  private listeners: Array<(state: QuotationState) => void> = [];

  constructor() {
    const persisted = localStorage.getItem(STORAGE_KEY);
    this.state = persisted ? JSON.parse(persisted) : defaultState;
  }

  public getState(): QuotationState {
    return { ...this.state };
  }

  public setState(patch: Partial<QuotationState>) {
    this.state = { ...this.state, ...patch };
    
    // Auto sync words if cost changed
    if (patch.totalCost !== undefined && !patch.costInWords) {
      this.state.costInWords = convertToIndianCurrencyWords(this.state.totalCost);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.listeners.forEach(fn => fn(this.state));
  }

  public subscribe(fn: (state: QuotationState) => void) {
    this.listeners.push(fn);
    fn(this.state);
  }
}

export const appStore = new Store();