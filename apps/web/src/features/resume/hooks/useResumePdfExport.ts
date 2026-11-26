import { useCallback, useState } from 'react';
import type { ResumeData } from '@/store/resumeStore';

export function useResumePdfExport(data: ResumeData) {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(() => {
    const preview = document.getElementById('resume-preview');
    if (!preview) return;

    setExporting(true);
    const printRoot = document.createElement('div');
    printRoot.id = 'print-root';
    printRoot.style.display = 'none';
    printRoot.setAttribute('aria-hidden', 'true');

    const printableResume = preview.cloneNode(true) as HTMLElement;
    printableResume.style.transform = 'none';
    printableResume.style.boxShadow = 'none';
    printableResume.style.border = 'none';
    printRoot.appendChild(printableResume);
    document.body.appendChild(printRoot);

    const previousTitle = document.title;
    document.title = `${(data.name || 'Resume').replace(/[^a-z0-9_-]+/gi, '_')}_Resume`;

    const cleanup = () => {
      window.removeEventListener('afterprint', cleanup);
      printRoot.remove();
      document.title = previousTitle;
      setExporting(false);
    };

    window.addEventListener('afterprint', cleanup, { once: true });
    requestAnimationFrame(() => {
      window.print();
    });
  }, [data.name]);

  return { exporting, exportPdf };
}
