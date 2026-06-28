'use client';

import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeEditor } from '@/features/resume/components/ResumeEditor';
import { ResumePreviewPanel } from '@/features/resume/components/ResumePreviewPanel';
import { ResumeToolbar } from '@/features/resume/components/ResumeToolbar';
import { useResumePdfExport } from '@/features/resume/hooks/useResumePdfExport';
import {
  ResumeViewToggle,
  type MobileResumeView,
} from '@/features/resume/components/ResumeViewToggle';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export default function ResumeBuilderClient() {
  const data = useResumeStore((state) => state.data);
  const printRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.85);
  const [mobileView, setMobileView] = useState<MobileResumeView>('editor');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const scaleInitialized = useRef(false);
  const { exporting, exportPdf } = useResumePdfExport(data);

  useEffect(() => {
    if (isDesktop === undefined || scaleInitialized.current) return;
    setPreviewScale(isDesktop ? 0.85 : 0.42);
    scaleInitialized.current = true;
  }, [isDesktop]);

  return (
    <div className="resume-builder-page flex h-dvh flex-col overflow-hidden bg-bg font-body text-text-primary">
      <ResumeToolbar
        previewScale={previewScale}
        exporting={exporting}
        onScaleChange={setPreviewScale}
        onExport={exportPdf}
      />
      <ResumeViewToggle value={mobileView} onChange={setMobileView} />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-hidden md:grid md:grid-cols-[360px_1fr]"
      >
        <div className={cn('h-full min-h-0', mobileView !== 'editor' && 'hidden md:block')}>
          <ResumeEditor />
        </div>
        <div className={cn('h-full min-h-0', mobileView !== 'preview' && 'hidden md:block')}>
          <ResumePreviewPanel ref={printRef} data={data} scale={previewScale} />
        </div>
      </main>
    </div>
  );
}
