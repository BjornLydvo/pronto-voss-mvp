
import type { NextApiRequest, NextApiResponse } from 'next';
import { orders, driverQueue } from '@/serverState';

export default function handler(req:NextApiRequest,res:NextApiResponse){
  res.json({orders, driverQueue, merchant:{}});
}
