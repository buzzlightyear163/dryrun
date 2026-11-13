import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import StatusBar from '../components/StatusBar';
import { SbarProvider } from '../hooks/useSbar';

export default function SiteLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <SbarProvider>
      <Nav />
      <Outlet />
      <Footer />
      <StatusBar />
    </SbarProvider>
  );
}
