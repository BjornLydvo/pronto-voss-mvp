
import type { NextApiRequest, NextApiResponse } from 'next';
import { orders, driverQueue } from '@/serverState';

export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method==='POST'){
    const body = req.body;
    const id = 'PV-'+Math.random().toString(36).slice(2,8).toUpperCase();
    const items = (body.items||[]).map((i:any)=>({merchantId:i.merchantId,itemId:i.itemId,name:i.name,price:i.price,qty:i.qty}));
    const total = items.reduce((s:number,i:any)=>s+i.price*i.qty,0);
    const order = { id, items, status:'placed', perMerchant:[], total, address: body.address||'', createdAt: Date.now() } as any;
    orders.push(order);
    driverQueue.push({orderId:id});
    res.status(200).json({ok:true, id});
    return;
  }
  res.status(405).end();
}
