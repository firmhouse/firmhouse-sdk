import { Inter } from 'next/font/google';
import './global.css';
import { NavBar } from '@firmhouse/ui-components';
import type { Metadata, Viewport } from 'next';
import { ProjectPicker } from './ProjectPicker';
import { getActiveProjectType } from '../lib/actions/projects';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Firmhouse Self Service Center Example App',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeProject = await getActiveProjectType();
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex-row bg-slate-50">
        <NavBar title="Firmhouse Self Service Center Example App">
          <ProjectPicker activeProject={activeProject} />
        </NavBar>
        {children}
      </body>
    </html>
  );
}
