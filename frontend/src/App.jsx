import { useEffect, useState } from 'react';
import ProductList from './ProductList';

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ env: 'offline', version: '-' }));
  }, []);

  return (
    <main className="container">
      {/* Banner se turant pata chalta hai ki staging dekh rahe ho ya production */}
      {health && (
        <div className={`env-banner env-${health.env}`} data-testid="env-banner">
          {health.env.toUpperCase()} · version {health.version}
        </div>
      )}
      <h1>Demo Jewellery Store</h1>
      <ProductList />
    </main>
  );
}
