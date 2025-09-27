
import { useEffect, useState } from 'react';

type Ordre = { id:string; status:string; total:number };

export default function Merchant(){
  const [orders,setOrders] = useState<Ordre[]>([]);
  const [paused,setPaused] = useState(false);

  const load = async()=>{
    const res = await fetch('/api/merchant'); const data = await res.json(); 
    setOrders(data.orders||[]); setPaused(data.paused||false);
  };
  useEffect(()=>{ load(); const i=setInterval(load,2000); return ()=>clearInterval(i); },[]);

  const accept = async(id:string)=>{ await fetch('/api/merchant?action=accept&id='+id); load(); };
  const reject = async(id:string)=>{ await fetch('/api/merchant?action=reject&id='+id); load(); };
  const toggle = async()=>{ await fetch('/api/merchant?action=toggle'); load(); };

  return (
    <div>
      <h1>Bedrift – ordrekø</h1>
      <div className="card row" style={{justifyContent:'space-between'}}>
        <div>Status: {paused? <b className="status-paused">PAUSE</b>: <b className="status-open">ÅPEN</b>}</div>
        <button className="btn ghost" onClick={toggle}>{paused?'Åpne for levering':'Sett på pause'}</button>
      </div>
      <div className="grid">
        {orders.map(o=>(
          <div className="card" key={o.id}>
            <div className="kicker">Ordre-ID</div>
            <h3>{o.id}</h3>
            <div>Total: <b>{o.total} kr</b></div>
            <div className="row" style={{marginTop:8}}>
              <button className="btn" onClick={()=>accept(o.id)}>Godta</button>
              <button className="btn secondary" onClick={()=>reject(o.id)}>Avvis</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
