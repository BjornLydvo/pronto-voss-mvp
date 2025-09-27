
import type { NextApiRequest, NextApiResponse } from 'next';
import { orders } from '@/serverState';

let paused = false;

export default function handler(req:NextApiRequest,res:NextApiResponse){
  const { action, id } = req.query as {action?:string; id?:string};
  if(req.method==='GET'){
    const open = orders.filter(o=>o.status==='placed').map(o=>({id:o.id,total:o.total}));
    res.json({orders:open, paused});
    return;
  }
  if(action==='toggle'){ paused = !paused; res.json({paused}); return; }
  const idx = orders.findIndex(o=>o.id===id);
  if(idx>=0){
    if(action==='accept') orders[idx].status='accepted';
    if(action==='reject') orders[idx].status='rejected';
  }
  res.json({ok:true});
}
