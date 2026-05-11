import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import ScrollReveal from '@/components/ScrollReveal';
import { CartProvider } from '@/contexts/CartContext';

export const metadata: Metadata = {
  title: 'Carnes & Cortes - Cortes Premium de Calidad Excepcional',
  description: 'Carnes & Cortes - Cortes especializados premium desde 2009',
  keywords: 'carnes premium, cortes especializados, carne de res, domicilios, carnicería',
  authors: [{ name: 'Carnes & Cortes' }],
  openGraph: {
    type: 'website',
    title: 'Carnes & Cortes',
    description: 'Carnes & Cortes - Cortes especializados premium desde 2009',
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartModal />
      <ScrollReveal />
      <div id="notificationContainer" className="fixed top-24 right-4 z-[70] space-y-2" />
    </CartProvider>
  );
}
