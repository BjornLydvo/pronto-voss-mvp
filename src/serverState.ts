
export type CartItem = { merchantId:string; itemId:string; name:string; price:number; qty:number };
export type Order = {
 id:string;
 items:CartItem[];
 status:'placed'|'accepted'|'preparing'|'ready'|'picked'|'delivered'|'rejected';
 perMerchant: { merchantId:string; accepted:boolean; paused:boolean }[];
 total:number;
 address:string;
 createdAt:number;
};
export const orders: Order[] = [];
export const driverQueue: {orderId:string; claimedBy?:string}[] = [];
