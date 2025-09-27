import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Link from 'next/link';
import { createContext, useMemo, useState } from 'react';

export type CartLine = {
  merchantId: string;
  merchantName: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
};

export type CartContext = {
  cart: CartLine[];
  setCart: (x: CartLine[]) => void;
  lang: 'nb' | 'en';
  setLang: (l: 'nb' | 'en') => void;
};

const defaultCtx: CartContext = {
  cart: [],
  setCart: () => {},
  lang: 'nb',
  setLang: () => {},
};

export const CartCtx = createContext<CartContext>(defaultCtx);

export default function MyApp({ Component, pageProps }: AppProps) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [lang, setLang] = useState<'nb' | 'en'>('nb');
  const value = useMemo<CartContext>(() => ({ cart, setCart, lang, setLang }), [cart, lang]);

  return (
    <CartCtx.Provider value={value}>
      <header className="header">
        <nav className="nav container">
          <div className="brand">
            <span style={{ width: 12, height: 12, background: 'var(--blue)', display: 'inline-block', borderRadius: 3 }} />
            <span>Pronto Voss</span>
            <span className="badge">MVP</span>
          </div>
          <div className="row">
            <Link href="/">Hjem</Link>
            <Link href="/cart">Handlekurv</Link>
            <Link href="/merchant">Bedrift</Link>
            <Link href="/driver">Sjåfør</Link>
            <Link href="/admin">Admin</Link>
            <span className="lang" onClick={() => setLang(lang === 'nb' ? 'en' : 'nb')}>
              {lang === 'nb' ? 'Bokmål / EN' : 'English / NB'}
            </span>
          </div>
        </nav>
      </header>
      <div className="container">
        <Component {...pageProps} />
      </div>
      <footer className="footer">
        <div>
          © {new Date().getFullYear()} Pronto Voss • Kundeservice 900 56 582 • <a href="/policy">Personvern & Vilkår</a>
        </div>
        <div className="kicker">Demo: fiktive data, ikkje ekte betaling</div>
      </footer>
    </CartCtx.Provider>
  );
}
