export type Category = 'material' | 'body' | 'panel';

export interface ComponentItem {
  id: string;
  name: string;
  defaultCategory: Category;
}

export interface QuotationState {
  refNo: string;
  date: string;
  clientDetails: string;
  subject: string;
  sizeSpecification: string;
  materials: string[];
  body: string[];
  panel: string[];
  totalCost: number;
  costInWords: string;
  deliveryTerms: string;
  paymentTerms: string;
  blankLetterheadMode: boolean;
}