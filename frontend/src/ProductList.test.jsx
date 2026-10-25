import { render, screen } from '@testing-library/react';
import ProductList, { formatPrice } from './ProductList';

describe('formatPrice', () => {
  it('formats in Indian rupees', () => {
    expect(formatPrice(125000)).toBe('₹1,25,000');
  });
});

describe('ProductList', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows products from the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: 'Gold Ring', price: 25000 }],
    });

    render(<ProductList />);

    expect(await screen.findByText('Gold Ring')).toBeInTheDocument();
    expect(screen.getByText('₹25,000')).toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 });

    render(<ProductList />);

    expect(await screen.findByText(/HTTP 500/)).toBeInTheDocument();
  });
});
