
import { useEffect, useState } from 'react';
export default function Admin(){
  const [state,setState] = useState<any>({orders:[], driverQueue:[], merchant:{paused:false}});
  const load = async()=>{ const r=await fetch('/api/state'); setState(await r.json()); };
  useEffect(()=>{ load(); const i=setInterval(load,2000); return ()=>clearInterval(i); },[]);

  return (
    <div>
      <h1>Admin – live oversikt</h1>
      <div className="grid">
        <div className="card">
          <h3>Ordrer</h3>
          <table className="table">
            <thead><tr><th>ID</th><th>Status</th><th>Sum</th><th>Oppretta</th></tr></thead>
            <tbody>{state.orders.map((o:any)=>(<tr key={o.id}><td>{o.id}</td><td>{o.status}</td><td>{o.total} kr</td><td>{new Date(o.createdAt).toLocaleTimeString()}</td></tr>))}</tbody>
          </table>
        </div>
        <div className="card">
          <h3>Sjåførkø</h3>
          {state.driverQueue.map((j:any)=>(<div key={j.orderId} className="row" style={{justifyContent:'space-between'}}><span>{j.orderId}</span><span>{j.claimedBy||'ledig'}</span></div>))}
        </div>
        <div className="card">
          <h3>Utbetalingar</h3>
          <div>Bedrifter: kvar måndag</div>
          <div>Sjåførar: annakvar onsdag</div>
        </div>
      </div>
    </div>
  )
}
