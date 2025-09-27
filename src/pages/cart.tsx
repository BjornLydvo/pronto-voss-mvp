
import { useContext, useMemo, useState } from 'react';
import { CartCtx } from './_app';

type Group = {
  merchantId: string;
  merchantName: string;
  items: Array<{ itemId: string; name: string; price: number; qty: number }>;
};

export default function Cart() {
  const { cart, setCart, lang } = useContext(CartCtx);
  const [address, setAddress] = useState('Strandavegen 6, 5700 Voss');
  const [zones] = useState<[number, number, number]>([3, 6, 10]);
  const [prices] = useState<[number, number, number]>([79, 109, 149]);

  const t = (nb: string, en: string) => (lang === 'nb' ? nb : en);

  // Gruppér handlekurvlinjer per bedrift
  const groups: Group[] = useMemo(
    () =>
      Object.values(
        cart.reduce((a: Record<string, Group>, l) => {
          if (!a[l.merchantId]) {
            a[l.merchantId] = {
              merchantId: l.merchantId,
              merchantName: l.merchantName,
              items: [],
            };
          }
          a[l.merchantId].items.push({
            itemId: l.itemId,
            name: l.name,
            price: l.price,
            qty: l.qty,
          });
          return a;
        }, {})
      ),
    [cart]
  );

  // Km pr. bedrift (demo-verdier til vi hentar faktisk avstand)
  const kmByMerchant: Record<string, number> = {
    'burger-king-voss': 2.4,
    'malin-sushi': 1.1,
    'pizza-voss': 4.8,
  };

  const deliveryCost = (km: number) =>
    km <= zones[0] ? prices[0] : km <= zones[1] ? prices[1] : prices[2];

  // 🔧 Viktig: reduce med startverdi og typar
  const subtotal: number = groups.reduce(
    (s: number, g: Group) =>
      s + g.items.reduce((x: number, i) => x + i.price * i.qty, 0),
    0
  );

  const delivery: number = groups.reduce(
    (s: number, g: Group) => s + deliveryCost(kmByMerchant[g.merchantId] ?? 2),
    0
  );

  const total: number = subtotal + delivery;

  const placeOrder = async () => {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, address }),
    });
    const ok = await res.json();
    alert(
      t('Ordre sendt! Ordre-ID: ', 'Order placed! ID: ') +
        ok.id +
        ' — ' +
        t(
          'Gå til bedrift/sjåfør/admin for å simulere flyten.',
          'Open merchant/driver/admin to simulate the flow.'
        )
    );
    setCart([]);
  };

  return (
    <div>
      <h1>{t('Handlekurv', 'Cart')}</h1>

      {groups.length === 0 ? (
        <div className="card">
          {t('Ingen varer i handlekurven.', 'Your cart is empty.')}
        </div>
      ) : (
        <div className="card">
          {groups.map((g) => (
            <div key={g.merchantId} style={{ marginBottom: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <b>{g.merchantName}</b>
                <span className="kicker">
                  {t('Levering', 'Delivery')}{' '}
                  {deliveryCost(kmByMerchant[g.merchantId] ?? 2)} kr
                </span>
              </div>

              {g.items.map((i) => (
                <div key={i.itemId} className="row" style={{ justifyContent: 'space-between' }}>
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span>{i.price * i.qty} kr</span>
                </div>
              ))}
            </div>
          ))}

          <hr />
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span>{t('Varer', 'Items')}</span>
            <b>{subtotal} kr</b>
          </div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span>{t('Levering', 'Delivery')}</span>
            <b>{delivery} kr</b>
          </div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span>{t('Total', 'Total')}</span>
            <b>{total} kr</b>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <input
              className="input"
              style={{ minWidth: 320 }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="btn" onClick={placeOrder}>
              {t('Betal (demo)', 'Pay (demo)')}
            </button>
          </div>

          <div className="kicker">
            {t(
              'Betaling (Vipps/kort/PayPal) kjem seinare – dette er ein demo.',
              'Payment (Vipps/card/PayPal) to be wired later – demo only.'
            )}
          </div>
        </div>
      )}
    </div>
  );
}
