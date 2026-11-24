import { useEffect,useState } from 'react';
export type Coupon={id:string;name:string;type:string;start:string;end:string;details:string;image:string;publicListing:boolean;singleUse:boolean;code:string;condition:string;chance:string;winnerLimit:string;referrals:string;status:'draft'|'saved'};
export type RichAsset={id:string;name:string;image:string;template:string;actions:{type:'連結'|'優惠券';value:string;label:string}[]};
export type RewardCard={color:string;goal:number;expiry:string;couponId:string;published:boolean};
export interface AssetData {coupons:Coupon[];richMessages:RichAsset[];reward:RewardCard|null}
const KEY='linetech.training.assets.v1', EVENT='linetech-assets-change';
const empty:AssetData={coupons:[],richMessages:[],reward:null};
export function readAssets():AssetData{try{return {...empty,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return empty;}}
export function updateAssets(patch:Partial<AssetData>):boolean{try{localStorage.setItem(KEY,JSON.stringify({...readAssets(),...patch}));window.dispatchEvent(new Event(EVENT));return true;}catch{return false;}}
export function useAssets(){const [data,setData]=useState(readAssets);useEffect(()=>{const reload=()=>setData(readAssets());window.addEventListener(EVENT,reload);window.addEventListener('storage',reload);return()=>{window.removeEventListener(EVENT,reload);window.removeEventListener('storage',reload);};},[]);return data;}
export function usableCoupons(data:AssetData){const today=new Date();const date=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');return data.coupons.filter(x=>x.status==='saved'&&x.end>=date);}
export const richLayouts:{id:string;name:string;areas:number[][]}[]=[
{id:'1',name:'1格',areas:[[0,0,1,1]]},
{id:'2v',name:'左右2格',areas:[[0,0,.5,1],[.5,0,.5,1]]},
{id:'2h',name:'上下2格',areas:[[0,0,1,.5],[0,.5,1,.5]]},
{id:'3h',name:'上下3格',areas:[[0,0,1,1/3],[0,1/3,1,1/3],[0,2/3,1,1/3]]},
{id:'4',name:'4格',areas:[[0,0,.5,.5],[.5,0,.5,.5],[0,.5,.5,.5],[.5,.5,.5,.5]]},
{id:'3top',name:'上1下2',areas:[[0,0,1,.5],[0,.5,.5,.5],[.5,.5,.5,.5]]},
{id:'3wide',name:'上半下兩列',areas:[[0,0,1,.5],[0,.5,1,.25],[0,.75,1,.25]]},
{id:'6',name:'6格',areas:[[0,0,1/3,.5],[1/3,0,1/3,.5],[2/3,0,1/3,.5],[0,.5,1/3,.5],[1/3,.5,1/3,.5],[2/3,.5,1/3,.5]]}
];
export function readImage(file:File|undefined,limit:number,dimensions?:[number,number]):Promise<string>{
 return new Promise((resolve,reject)=>{if(!file){reject(new Error('未選擇圖片'));return;}if(!['image/png','image/jpeg'].includes(file.type)||file.size>limit){reject(new Error('請選 JPG 或 PNG，且不超過 '+Math.round(limit/1024/1024)+'MB（本機教學限制）'));return;}const reader=new FileReader();reader.onerror=()=>reject(new Error('檔案讀取失敗'));reader.onload=()=>{const url=String(reader.result);const image=new Image();image.onload=()=>{if(dimensions&&(image.width!==dimensions[0]||image.height!==dimensions[1]))reject(new Error('圖片需為 '+dimensions.join(' × ')+' px'));else resolve(url);};image.onerror=()=>reject(new Error('圖片無法解碼'));image.src=url;};reader.readAsDataURL(file);});
}
