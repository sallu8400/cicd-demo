import { useEffect, useState } from 'react';

export function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">Products load nahi hue: {error}</p>;

  return (
    <ul className="products">
      {products.map((p) => (
        <li key={p.id}>
          <span>{p.name}</span>
          <strong>{formatPrice(p.price)}</strong>
        </li>
      ))}
    </ul>
  );
}
