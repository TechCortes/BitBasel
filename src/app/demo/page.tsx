import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DemoPitchFlow from '@/components/demo/DemoPitchFlow';
import '@/styles/demo.css';

export default function DemoPage() {
  return (
    <>
      <Navigation />
      <main>
        <DemoPitchFlow />
      </main>
      <Footer />
    </>
  );
}
