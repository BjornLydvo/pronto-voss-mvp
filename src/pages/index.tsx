
import { useContext, useEffect, useState } from 'react';
import merchantsData from '@/data/merchants.json';
import { CartCtx } from './_app';

type Merchant = typeof merchantsData[number];

export default function Home(){
  const { cart, setCart, lang } = useContext(CartCtx);
  const [address, setAddress] = useState('Strandavegen 6, 5700 Voss');
  const [zones, setZones] = useState([3,6,10]); // km thresholds
  const [prices, setPrices] = useState([79,109,149]); // NOK per zone

  const t = (nb:string,en:string)=> lang==='nb'?nb:en;

  const add = (m:Merchant, item:{id:string;name:string;price:number})=>{
    const exist = cart.find(c=>c.itemId===item.id && c.merchantId===m.id);
    if(exist){
      exist.qty += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, {merchantId:m.id, merchantName:m.name, itemId:item.id, name:item.name, price:item.price, qty:1}]);
    }
  };

  const deliveryCost = (km:number)=>{
    if(km<=zones[0]) return prices[0];
    if(km<=zones[1]) return prices[1];
    return prices[2];
  };

  const groupedByMerchant = Object.values(cart.reduce((acc:any,line)=>{
    acc[line.merchantId] = acc[line.merchantId] || {merchantId:line.merchantId, merchantName:line.merchantName, items:[], km: merchantsData.find(m=>m.id===line.merchantId)?.distance_km||0};
    acc[line.merchantId].items.push(line);
    return acc;
  }, {}));

  const cartTotal = groupedByMerchant.reduce((sum:any,g:any)=> sum + g.items.reduce((s:any,i:any)=>s+i.price*i.qty,0) + deliveryCost(g.km), 0);

  return (
    <div>
      <h1>{t('Bestill mat – fleire bedrifter i same handlekurv','Order food – multi‑merchant cart')}</h1>
      <div className="card">
        <div className="row">
          <div><b>{t('Leveringsadresse','Delivery address')}</b></div>
          <input className="input" style={{minWidth:320}} value={address} onChange={e=>setAddress(e.target.value)} />
        </div>
        <div className="row" style={{marginTop:10}}>
          <span className="kicker">{t('Km‑soner (admin‑demo)','Km zones (admin demo)')}</span>
          <span>S1 ≤ <input className="input" style={{width:60}} value={zones[0]} onChange={e=>setZones([+e.target.value||0,zones[1],zones[2]])}/> km = {prices[0]} kr</span>
          <span>S2 ≤ <input className="input" style={{width:60}} value={zones[1]} onChange={e=>setZones([zones[0],+e.target.value||0,zones[2]])}/> km = {prices[1]} kr</span>
          <span>S3 &gt; {zones[1]} km = {prices[2]} kr</span>
          <span>{t('Endre prisar:','Edit prices:')} <input className="input" style={{width:60}} value={prices[0]} onChange={e=>setPrices([+e.target.value||0,prices[1],prices[2]])}/> / <input className="input" style={{width:60}} value={prices[1]} onChange={e=>setPrices([prices[0],+e.target.value||0,prices[2]])}/> / <input className="input" style={{width:60}} value={prices[2]} onChange={e=>setPrices([prices[0],prices[1],+e.target.value||0])}/> kr</span>
        </div>
      </div>

      <div className="grid">
        {merchantsData.map(m=>(
          <div key={m.id} className="card">
            <div className="row" style={{justifyContent:'space-between'}}>
              <h3>{m.name}</h3>
              <span className="chip">{m.distance_km} km</span>
            </div>
            <div className="kicker">{m.open? (m.paused? t('PAUSE for levering','Delivery paused') : t('Åpen','Open')) : t('Stengt','Closed')}</div>
            {m.menu.map(item=>(
              <div key={item.id} className="row" style={{justifyContent:'space-between', marginTop:8}}>
                <div>{item.name}</div>
                <div className="row">
                  <div><b>{item.price} kr</b></div>
                  <button className="btn" onClick={()=>add(m,item)}>{t('Legg til','Add')}</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card row" style={{justifyContent:'space-between'}}>
        <div>{t('Handlekurv','Cart')}: <b>{cart.length}</b> {t('varer','items')}</div>
        <div>{t('Estimert total inkl. levering','Estimated total incl. delivery')}: <b>{cartTotal} kr</b></div>
      </div>
    </div>
  )
}
