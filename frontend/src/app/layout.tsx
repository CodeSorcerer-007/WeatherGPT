import type { Metadata } from 'next';
import './globals.css';
import { WeatherProvider } from '@/context/WeatherContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { PersonaProvider } from '@/context/PersonaContext';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { EmergencyAlertBanner } from '@/components/layout/EmergencyAlertBanner';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'WeatherGPT — Conversational AI Weather Intelligence & Disaster Platform',
  description:
    'Grounded meteorological intelligence, real-time extreme weather alerts, agricultural advisories, GIS maps, and multilingual voice assistance for India.',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <AccessibilityProvider>
          <LanguageProvider>
            <PersonaProvider>
              <WeatherProvider>
                <EmergencyAlertBanner />
                <div className="flex min-h-screen">
                  {/* Desktop Left Sidebar Navigation */}
                  <Sidebar />

                  {/* Main Application Column */}
                  <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
                    <Header />
                    <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
                      {children}
                    </main>
                  </div>
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <MobileNav />
              </WeatherProvider>
            </PersonaProvider>
          </LanguageProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
