import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  VerticalAlign,
} from 'docx';
import saveAs from 'file-saver';
import { QuotationState } from '../types';

async function fetchHeaderImageBuffer(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch('/header.png');
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function generateWordDocument(state: QuotationState): Promise<void> {
  const headerBuffer = await fetchHeaderImageBuffer();

  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };
  const borderNoneGroup = {
    top: noBorder,
    bottom: noBorder,
    left: noBorder,
    right: noBorder,
    insideVertical: noBorder,
    insideHorizontal: noBorder,
  };

  const formatList = (items: string[]) =>
    items.map((item, idx) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${String(idx + 1).padStart(2, '0')}) `, font: 'Times New Roman', size: 21, color: '444444' }),
          new TextRun({ text: item, font: 'Times New Roman', size: 21 }),
        ],
        spacing: { before: 20, after: 20 },
      })
    );

  const documentChildren: (Paragraph | Table)[] = [];

  // Quotation Label
  documentChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'QUOTATION', bold: true, color: 'C00000', size: 22, font: 'Times New Roman' }),
      ],
      spacing: { after: 40 },
    })
  );

  // Side-by-side Header Table (Left: header.png, Right: Address)
  const leftCellChildren: Paragraph[] = [];
  if (headerBuffer && !state.blankLetterheadMode) {
    leftCellChildren.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: headerBuffer,
            transformation: { width: 310, height: 75 },
          }),
        ],
      })
    );
  }

  documentChildren.push(
    new Table({
      width: { size: 10700, type: WidthType.DXA },
      borders: borderNoneGroup,
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 6700, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: leftCellChildren,
            }),
            new TableCell({
              width: { size: 4000, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: 'Factory :-\n', bold: true, color: 'C00000', size: 16, font: 'Times New Roman' }),
                    new TextRun({ text: 'Vill. + P.O. - Bhendergacha\n', size: 15, font: 'Times New Roman' }),
                    new TextRun({ text: 'P.S. - Amta, Dist. - Howrah\n', size: 15, font: 'Times New Roman' }),
                    new TextRun({ text: 'Pin - 711401\n', size: 15, font: 'Times New Roman' }),
                    new TextRun({ text: 'Office :-\n', bold: true, color: 'C00000', size: 16, font: 'Times New Roman' }),
                    new TextRun({ text: 'Baltikuri, Kalitala, Howrah\n', size: 15, font: 'Times New Roman' }),
                    new TextRun({ text: 'Mob. : 96740 39225', size: 15, font: 'Times New Roman' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Subtitle Scope
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Electric Chamber Furnace, Over Hot Plate, Air Circulating Furnace, Round Type Furnace, Welding Electroed Heating Furnace, Oil Fornace, Bogie, Type Electric Furnace & All Types Furnace Repairing Here.',
          color: 'C00000',
          size: 13,
          font: 'Times New Roman',
        }),
      ],
      spacing: { before: 60, after: 100 },
    })
  );

  // Ref. No. & Date
  documentChildren.push(
    new Table({
      width: { size: 10700, type: WidthType.DXA },
      borders: borderNoneGroup,
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 6000, type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Ref. No. : ', bold: true, size: 22, font: 'Times New Roman' }),
                    new TextRun({ text: state.refNo, size: 22, font: 'Times New Roman' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 4700, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: 'Date : ', bold: true, size: 22, font: 'Times New Roman' }),
                    new TextRun({ text: state.date, size: 22, font: 'Times New Roman' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Address
  documentChildren.push(
    new Paragraph({ children: [new TextRun({ text: 'To,', font: 'Times New Roman', size: 22 })], spacing: { before: 100, after: 10 } }),
    ...state.clientDetails.split('\n').map((line) =>
      new Paragraph({
        children: [new TextRun({ text: `    ${line}`, font: 'Times New Roman', size: 22 })],
        spacing: { before: 10, after: 10 },
      })
    ),
    // Subject
    new Paragraph({
      children: [
        new TextRun({ text: `Sub : ${state.subject}`, bold: true, font: 'Times New Roman', size: 22 }),
      ],
      spacing: { before: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `         ${state.sizeSpecification}`, bold: true, font: 'Times New Roman', size: 22 }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Dear Sir,', font: 'Times New Roman', size: 22 })],
      spacing: { before: 10, after: 10 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'We are grateful to you in receiving of your valued enquiry and in this regard we are sending herewith our lowest quotation of the subject items :',
          font: 'Times New Roman',
          size: 22,
        }),
      ],
      spacing: { after: 120 },
    })
  );

  // 3-Column Specifications Table
  documentChildren.push(
    new Table({
      width: { size: 10700, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: '444444' },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '444444' },
        left: noBorder,
        right: noBorder,
        insideVertical: noBorder,
        insideHorizontal: noBorder,
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            // Col 1: Material & Panel
            new TableCell({
              width: { size: 3800, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              margins: { top: 40, bottom: 40, left: 30, right: 30 },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Material Description', bold: true, font: 'Times New Roman', size: 22 })], spacing: { after: 40 } }),
                ...formatList(state.materials),
                new Paragraph({ children: [new TextRun({ text: 'PANEL', bold: true, font: 'Times New Roman', size: 22 })], spacing: { before: 80, after: 40 } }),
                ...formatList(state.panel),
              ],
            }),
            // Col 2: Body
            new TableCell({
              width: { size: 2900, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              margins: { top: 40, bottom: 40, left: 30, right: 30 },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'BODY.', bold: true, font: 'Times New Roman', size: 22 })], spacing: { after: 40 } }),
                ...formatList(state.body),
              ],
            }),
            // Col 3: Commercials
            new TableCell({
              width: { size: 4000, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              margins: { top: 40, bottom: 40, left: 40, right: 20 },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Rate (Rs.)', bold: true, font: 'Times New Roman', size: 22 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Total Furnace Cost', font: 'Times New Roman', size: 21 })], spacing: { before: 20 } }),
                new Paragraph({
                  children: [new TextRun({ text: `Rs.${state.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, bold: true, font: 'Times New Roman', size: 24 })],
                  spacing: { before: 20, after: 20 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: `(${state.costInWords})`, italics: true, font: 'Times New Roman', size: 19 })],
                  spacing: { after: 80 },
                }),
                new Paragraph({ children: [new TextRun({ text: 'TERMS & CONDITIONS :', bold: true, font: 'Times New Roman', size: 22 })], spacing: { after: 40 } }),
                new Paragraph({ children: [new TextRun({ text: '1) DELIVERY :', bold: true, font: 'Times New Roman', size: 21 })] }),
                new Paragraph({ children: [new TextRun({ text: `   ${state.deliveryTerms}`, font: 'Times New Roman', size: 19 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '2) PAYMENT :', bold: true, font: 'Times New Roman', size: 21 })] }),
                ...state.paymentTerms.split('\n').map((p) => new Paragraph({ children: [new TextRun({ text: `   ${p}`, font: 'Times New Roman', size: 19 })], spacing: { before: 10, after: 10 } })),
                new Paragraph({ children: [new TextRun({ text: '3) G.S.T. : Extra.', bold: true, font: 'Times New Roman', size: 21 })], spacing: { before: 30, after: 80 } }),
                new Paragraph({ children: [new TextRun({ text: 'N.B. Fooding, Lodging, Transport charges extra at actual.', bold: true, font: 'Times New Roman', size: 18 })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 500, right: 600, bottom: 500, left: 600 },
          },
        },
        children: documentChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Quotation_${state.refNo.replace(/[/\\?%*:|"<>]/g, '_')}.docx`);
}