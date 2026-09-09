'use client';

import { ErrorState } from '../../../src/components/layout/ErrorState/ErrorState';

export default function ProjectError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}
