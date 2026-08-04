import { forwardRef } from 'react';
import ResumePreview from './preview/ResumePreview';
import type { ResumeData } from '@/store/resumeStore';

interface ResumePreviewPanelProps {
  data: ResumeData;
  scale: number;
}

export const ResumePreviewPanel = forwardRef<HTMLDivElement, ResumePreviewPanelProps>(
  ({ data, scale }, ref) => (
    <div
      className="flex h-full min-h-0 flex-col items-center overflow-auto bg-[#030709] bg-[radial-gradient(rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[length:30px_30px] p-3 sm:p-8"
      role="complementary"
      aria-label="Resume preview"
    >
      <p className="mb-4 text-center font-mono text-[10px] text-text-dim">
        Live Preview · {Math.round(scale * 100)}%
      </p>
      <div
        className="relative shrink-0"
        style={{ width: `${794 * scale}px`, height: `${1123 * scale}px` }}
      >
        <div ref={ref} className="absolute left-0 top-0 origin-top-left">
          <ResumePreview data={data} scale={scale} />
        </div>
      </div>
      <p className="mt-6 max-w-sm text-center font-mono text-[10px] leading-relaxed text-text-dim">
        ↑ Live preview — changes appear instantly.
        <br />
        Exported PDF matches this design exactly.
      </p>
    </div>
  ),
);

ResumePreviewPanel.displayName = 'ResumePreviewPanel';
