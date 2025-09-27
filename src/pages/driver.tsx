
import { useEffect, useState } from 'react';
type Job = { orderId:string; claimedBy?:string };

export default function Driver(){
  const [ready,setReady] = useState(false);
  const [queue,setQueue] = useState<Job[]>([]);
  const [me] = useState('driver-1');

  const load = async()=>{ const r=await fetch('/api/driver'); setQueue(await r.json()); };
  useEffect(()=>{ load(); const i=setInterval(load,2000); return ()=>clearInterval(i); },[]);

  const claim = async(orderId:string)=>{ await fetch('/api/driver?action=claim&orderId='+orderId+'&me='+me); load(); };

  return (
    <div>
      <h1>Sjåfør</h1>
      <div className="card row" style={{justifyContent:'space-between'}}>
        <div>Status: {ready? <b className="status-open">Klar</b>: <b className="status-closed">Ikkje klar</b>}</div>
        <button className="btn" onClick={()=>setReady(!ready)}>{ready?'Sett Ikkje klar':'Sett Klar'}</button>
      </div>
      <div className="grid">
        {queue.map(j=>(
          <div className="card" key={j.orderId}>
            <div>Ordre: <b>{j.orderId}</b></div>
            <div>{j.claimedBy? 'Teke av '+j.claimedBy : 'Tilgjengeleg'}</div>
            <button className="btn" onClick={()=>claim(j.orderId)} disabled={!!j.claimedBy}>Den tar eg</button>
          </div>
        ))}
      </div>
    </div>
  )
}
