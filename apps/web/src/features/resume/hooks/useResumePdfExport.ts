import { useCallback, useState } from 'react';
import type { ResumeData } from '@/store/resumeStore';

const captureStyles = {
  width: '794px',
  minHeight: '1123px',
  maxHeight: '1123px',
  overflow: 'hidden',
};

export function useResumePdfExport(data: ResumeData) {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(async () => {
    setExporting(true);
    const element = document.getElementById('resume-preview');
    if (!element) {
      setExporting(false);
      return;
    }

    const previousTransform = element.style.transform;

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      Object.assign(element.style, {
        ...captureStyles,
        transform: 'none',
        boxShadow: 'none',
        border: 'none',
      });

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: data.layoutStyle === 'terminal' ? '#050A0E' : '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        onclone: (documentClone) => {
          const clonedPreview = documentClone.getElementById('resume-preview');
          if (clonedPreview) {
            Object.assign(clonedPreview.style, {
              ...captureStyles,
              transform: 'none',
              boxShadow: 'none',
              border: 'none',
            });
          }
        },
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG', 0, 0, 210, 297, undefined, 'FAST');

      const previewRect = element.getBoundingClientRect();
      element.querySelectorAll<HTMLAnchorElement>('a[data-pdf-link]').forEach((link) => {
        const rect = link.getBoundingClientRect();
        const x = ((rect.left - previewRect.left) / previewRect.width) * 210;
        const y = ((rect.top - previewRect.top) / previewRect.height) * 297;
        const width = (rect.width / previewRect.width) * 210;
        const height = (rect.height / previewRect.height) * 297;

        if (width > 0 && height > 0 && x >= 0 && y >= 0 && x < 210 && y < 297) {
          pdf.link(x, y, Math.min(width, 210 - x), Math.min(height, 297 - y), {
            url: link.href,
          });
        }
      });
      pdf.save(`${(data.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      Object.assign(element.style, {
        transform: previousTransform,
        boxShadow: '',
        border: '',
        width: '210mm',
        minHeight: '297mm',
        maxHeight: '',
        overflow: '',
      });
      setExporting(false);
    }
  }, [data]);

  return { exporting, exportPdf };
}
