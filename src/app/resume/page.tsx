import { Metadata } from 'next'
import ResumeBuilderClient from './ResumeBuilderClient'

export const metadata: Metadata = {
  title: 'Resume Builder',
  description:
    'Build a professional, design-forward resume. Live preview and one-click PDF export.',
}

export default function ResumePage() {
  return <ResumeBuilderClient />
}
