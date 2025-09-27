
import type { NextApiRequest, NextApiResponse } from 'next';
import { driverQueue } from '@/serverState';

export default function handler(req:NextApiRequest,res:NextApiResponse){
  const { action, orderId, me } = req.query as { action?:string; orderId?:string; me?:string };
  if(req.method==='GET'){ res.json(driverQueue); return; }
  if(action==='claim'){
    const j = driverQueue.find(x=>x.orderId===orderId);
    if(j && !j.claimedBy){ j.claimedBy = me || 'driver'; }
    res.json({ok:true}); return;
  }
  res.status(405).end();
}
