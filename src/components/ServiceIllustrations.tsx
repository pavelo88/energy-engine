import type { ComponentType } from "react";

type SvgProps = { className?: string };

export const MaintIllustration: ComponentType<SvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    <path d="M2 22l4-4" />
    <path d="M16 8l4 4" />
  </svg>
);

export const InspectIllustration: ComponentType<SvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    <rect x="8" y="12" width="12" height="8" rx="2" />
    <path d="m14 16-2 2 4 4" />
    <path d="m20 12-2-2" />
  </svg>
);

export const AuditIllustration: ComponentType<SvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
    <path d="m7 10.5-2.5-2.5" />
    <path d="m7 10.5 2.5 2.5" />
  </svg>
);

export const MgmtIllustration: ComponentType<SvgProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v18h18" />
    <path d="M18.7 8.3a2.4 2.4 0 0 0-3.4 0L12 11.6l-3.3-3.3a2.4 2.4 0 0 0-3.4 0l-3.3 3.3" />
    <path d="m3 14 3-3 3.3 3.3" />
    <path d="M12.6 18.6a2.4 2.4 0 0 0 3.4 0l3.3-3.3" />
  </svg>
);
