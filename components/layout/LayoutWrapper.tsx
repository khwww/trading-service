'use client';

import { useState } from 'react';
import Sidebar from '@/components/side-bar/Sidebar';

type PanelType = 'favorites' | 'recent' | 'realtime' | null;

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  return (
    <>
      <style jsx global>{`
        .header-dynamic-padding {
          padding-right: ${activePanel ? '30rem' : '6rem'} !important;
          transition: padding-right 0.3s;
        }
        .detail-content-padding {
          padding-right: ${activePanel ? '28rem' : '4rem'} !important;
          transition: padding-right 0.3s;
        }
        .main-content-padding {
          padding-right: ${activePanel ? '28rem' : '6rem'} !important;
          transition: padding-right 0.3s;
        }
      `}</style>
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      {children}
    </>
  );
}
