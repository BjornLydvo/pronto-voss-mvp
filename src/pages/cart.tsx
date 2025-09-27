import { useContext, useMemo, useState } from 'react';
import merchantsData from '@/data/merchants.json';
import { CartCtx } from './_app';

type Merchant = {
  id: string;
  name: string;
  distance_km: number;
  open: boolean;
  paused: boolean;
  menu: { id: string; name: string; price: number }[];
};

type CartLine = {
  merchantId: string;
  merchantName: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
};

export default function Home() {
  const { cart, setCart, lang } = useContext(CartCtx);
  const [address, setAddress] = useState('Strandavegen 6, 5700 Voss');
  const [zones, setZones] = useState<[number, number, number]>([3, 6, 10]); // km tersklar
  const [prices, setPrices] = useState<[number, number, number]>([79, 109, 149]); // NOK per sone

  const t = (nb: string, en: string) => (lang === 'nb' ? nb : en);

  const add = (m: Merchant, item: { id: string; name: string; price: number }) => {
    const exist = cart.find((c: CartLine) => c.itemId === item.id && c.merchantId === m.id);
    if (exist) {
      exist.qty += 1;
      setCart([...cart]);
    } else {
      setCart([
        ...cart,
        {
          merchantId: m.id,
          merchantName: m.name,
          itemId: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
        },
      ]);
    }
  };

  const deliveryCost = (km: number): number => {
    if (km <= zones[0]) return prices[0];
    if (km <= zones[1]) return prices[1];
    return prices[2];
  };

  // Gruppér handlekurvlinjer per bedrift
  const groupedByMerchant = useMemo(() => {
    const acc: Record<
      string,
      { merchantId: string; merchantName: string; items: CartLine[]; km: number }
    > = {};
    (cart as CartLine[]).forEach((line) => {
      if (!acc[line.merchantId]) {
        const km = (merchantsData as Merchant[]).find((m) => m.id === line.merchantId)?.distance_km ?? 0;
        acc[line.merchantId] = {
          merchantId: line.merchantId,
          merchantName: line.merchantName,
          items: [],
          km,
        };
      }
      acc[line.merchantId].items.push(line);
    });
    return Object.values(acc);
  }, [cart]);

  // Total inkl. levering pr. bedrift
  const cartTotal: number = groupedByMerchant.reduce((sum, g) => {
    const itemsSum = g.items.reduce((s, i) => s + i.price * i.qty, 0);
    return sum + itemsSum + deliveryCost(g.km);
  }, 0);

  return (
    <div>
      <h1>{t('Bestill mat – fleire bedrifter i same handlekorg', 'Order food – multi-merchant cart')}</h1>

      <div className="card">
        <div className="row">
          <div>
            <b>{t('Leveringsadresse', 'Delivery address')}</b>
          </div>
          <input
            className="input"
            style={{ minWidth: 320 }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <span className="kicker">{t('Km-soner (admin-demo)', 'Km zones (admin demo)')}</span>
          <span>
            S1 ≤{' '}
            <input
              className="input"
              style={{ width: 60 }}
              value={zones[0]}
              onChange={(e) => setZones([Number(e.target.value) || 0, zones[1], zones[2]])}
            />{' '}
            km = {prices[0]} kr
          </span>
          <span>
            S2 ≤{' '}
            <input
              className="input"
              style={{ width: 60 }}
              value={zones[1]}
              onChange={(e) => setZones([zones[0], Number(e.target.value) || 0, zones[2]])}
            />{' '}
            km = {prices[1]} kr
          </span>
          <span>
            S3 &gt; {zones[1]} km = {prices[2]} kr
          </span>
          <span>
            {t('Endre prisar:', 'Edit prices:')}{' '}
            <input
              className="input"
              style={{ width: 60 }}
              value={prices[0]}
              onChange={(e) => setPrices([Number(e.target.value) || 0, prices[1], prices[2]])}
            />{' '}
            /{' '}
            <input
              className="input"
              style={{ width: 60 }}
              value={prices[1]}
              onChange={(e) => setPrices([prices[0], Number(e.target.value) || 0, prices[2]])}
            />{' '}
            /{' '}
            <input
              className="input"
              style={{ width: 60 }}
              value={prices[2]}
              onChange={(e) => setPrices([prices[0], prices[1], Number(e.target.value) || 0])}
            />{' '}
            kr
          </span>
        </div>
      </div>

      <div className="grid">
        {(merchantsData as Merchant[]).map((m) => (
          <div key={m.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3>{m.name}</h3>
              <span className="chip">{m.distance_km} km</span>
            </div>
            <div className="kicker">
              {m.open ? (m.paused ? t('PAUSE for levering', 'Delivery paused') : t('Åpen', 'Open')) : t('Stengt', 'Closed')}
            </div>
            {m.menu.map((item) => (
              <div key={item.id} className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                <div>{item.name}</div>
                <div className="row">
                  <div>
                    <b>{item.price} kr</b>
                  </div>
                  <button className="btn" onClick={() => add(m, item)}>
                    {t('Legg til', 'Add')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card row" style={{ justifyContent: 'space-between' }}>
        <div>
          {t('Handlekurv', 'Cart')}: <b>{(cart as CartLine[]).length}</b> {t('varer', 'items')}
        </div>
        <div>
          {t('Estimert total inkl. levering', 'Estimated total incl. delivery')}: <b>{cartTotal} kr</b>
        </div>
      </div>
    </div>
  );
}
