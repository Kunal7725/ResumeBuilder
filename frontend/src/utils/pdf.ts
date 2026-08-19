import type { ResumeData } from '../types/resume';

export async function downloadPDF(elementId: string, filename = 'resume.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume preview element not found');

  try {
    const mod = await import('html2pdf.js');
    // handle both default and named exports across bundlers
    const html2pdf = (mod as unknown as { default?: unknown }).default ?? mod;

    await (html2pdf as CallableFunction)()
      .set({
        margin: [8, 8, 8, 8] as [number, number, number, number],
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          // capture the live element directly — styles are already computed
          windowWidth: element.scrollWidth,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      })
      .from(element)
      .save();
  } catch (err) {
    // Fallback: open print dialog
    console.warn('html2pdf failed, falling back to print:', err);
    const printWindow = window.open('', '_blank');
    if (!printWindow) throw new Error('Popup blocked. Allow popups and try again.');

    // Collect all stylesheets from the current page
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch {
          return sheet.href ? `@import url("${sheet.href}");` : '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${filename}</title>
          <style>
            ${styles}
            @page { size: A4; margin: 8mm; }
            body { margin: 0; background: white; }
          </style>
        </head>
        <body>${element.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }
}

export function exportJSON(data: ResumeData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (typeof parsed !== 'object' || parsed === null || !parsed.personalInfo)
          return reject(new Error('Invalid resume JSON: missing required fields'));
        resolve(parsed as ResumeData);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
