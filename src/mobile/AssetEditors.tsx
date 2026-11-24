import {useState} from 'react';
import {ChevronLeft} from 'lucide-react';
import {useAssets,updateAssets,usableCoupons,richLayouts,readImage,type Coupon,type RichAsset,type RewardCard} from './trainingAssets';

type Kind='richmessage'|'coupon'|'stampcard';
const titleMap:Record<Kind,string>={richmessage:'圖文訊息',coupon:'優惠券',stampcard:'集點卡'};
const uid=()=>Date.now()+'-'+Math.random().toString(36).slice(2);
const newCoupon=(type='無條件'):Coupon=>({id:uid(),name:'',type,start:'',end:'',details:'',image:'',publicListing:false,singleUse:true,code:'',condition:'',chance:'50',winnerLimit:'',referrals:'1',status:'draft'});
const newRich=():RichAsset=>({id:uid(),name:'',image:'',template:'1',actions:[{type:'連結',value:'',label:''}]});
const newReward=():RewardCard=>({color:'#06c755',goal:10,expiry:'最後一次使用後 6 個月',couponId:'',published:false});
const validUrl=(x:string)=>{try{return ['http:','https:'].includes(new URL(x).protocol)}catch{return false;}};
export function AssetEditors({kind,onBack}:{kind:Kind;onBack:()=>void}){
 const assets=useAssets();
 const [page,setPage]=useState<'list'|'type'|'edit'>('list');
 const [coupon,setCoupon]=useState(newCoupon);
 const [rich,setRich]=useState(newRich);
 const [reward,setReward]=useState(()=>assets.reward||newReward());
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [busy,setBusy]=useState(false);
 const usable=usableCoupons(assets);
 const layout=richLayouts.find(x=>x.id===rich.template)||richLayouts[0];
 const changeCoupon=(p:Partial<Coupon>)=>setCoupon(v=>({...v,...p}));
 const changeRich=(p:Partial<RichAsset>)=>setRich(v=>({...v,...p}));
 const changeReward=(p:Partial<RewardCard>)=>setReward(v=>({...v,...p}));
 const upload=async(file:File|undefined,forRich:boolean)=>{if(!file)return;setError('');setBusy(true);try{const image=await readImage(file,2*1024*1024,forRich?[1040,1040]:undefined);if(forRich)changeRich({image});else changeCoupon({image});}catch(e){setError(e instanceof Error?e.message:'圖片讀取失敗');}finally{setBusy(false);}};
 const commit=(patch:Parameters<typeof updateAssets>[0],message:string)=>{if(updateAssets(patch)){setPage('list');setError('');setNotice(message);}else setError('本機儲存空間不足，請縮小圖片後重試');};
 const couponValid=Boolean(coupon.name.trim()&&coupon.start&&coupon.end&&coupon.start<=coupon.end&&coupon.image&&coupon.details.trim()&&(coupon.type!=='抽獎'||(Number(coupon.chance)>0&&Number(coupon.chance)<=100&&(!coupon.winnerLimit||Number(coupon.winnerLimit)>0)))&&(coupon.type!=='好友介紹'||Number(coupon.referrals)>0));
 const saveCoupon=(status:Coupon['status'])=>{if(!coupon.name.trim()||(status==='saved'&&!couponValid))return;const next={...coupon,status};commit({coupons:[next,...assets.coupons.filter(x=>x.id!==coupon.id)]},status==='draft'?'草稿已儲存':'優惠券已建立，可於群發及圖文選單選用');};
 const richValid=Boolean(rich.name.trim()&&rich.image&&rich.actions.length===layout.areas.length&&rich.actions.every(a=>a.label.trim()&&(a.type==='連結'?validUrl(a.value):usable.some(x=>x.id===a.value))));
 const setArea=(i:number,p:Partial<RichAsset['actions'][number]>)=>changeRich({actions:rich.actions.map((a,j)=>j===i?{...a,...p}:a)});
 const back=()=>{setError('');setNotice('');if(page==='list')onBack();else if(page==='edit'&&kind==='coupon')setPage('type');else setPage('list');};
 const start=()=>{setError('');setNotice('');if(kind==='coupon'){setPage('type');}else if(kind==='richmessage'){setRich(newRich());setPage('edit');}else{setReward(assets.reward||newReward());setPage('edit');}};
 const couponOptions=usable.map(x=><option key={x.id} value={x.id}>{x.name}</option>);
 return <div className="oa-mobile-screen asset-editor-screen">
 <div className="oa-mobile-header"><button aria-label="返回" onClick={back}><ChevronLeft size={28}/></button><strong>{page==='list'?titleMap[kind]:page==='type'?'建立優惠券':'建立'+titleMap[kind]}</strong><span/></div>
 <div className="asset-editor-body">
 {notice&&<p role="status" className="asset-note">{notice}</p>}
 {error&&<p role="alert" className="menu-practice-error">{error}</p>}
 {page==='list'&&(kind==='coupon'?<>{!assets.coupons.length&&<div className="official-empty-center">尚無優惠券</div>}{assets.coupons.map(x=><div className="asset-record" key={x.id}>{x.image&&<img src={x.image} alt=""/>}<div><strong>{x.name}</strong><small>{x.type}・{x.status==='draft'?'草稿':'已建立'}<br/>{x.start} ～ {x.end}</small></div><button onClick={()=>{setCoupon(x.status==='draft'?{...x}:{...x,id:uid(),status:'draft'});setPage('edit');}}>{x.status==='draft'?'編輯':'複製'}</button>{x.status==='draft'&&<button onClick={()=>{if(!updateAssets({coupons:assets.coupons.filter(y=>y.id!==x.id)}))setError('刪除失敗');}}>刪除</button>}</div>)}</>:kind==='richmessage'?<>{!assets.richMessages.length&&<div className="official-empty-center">尚無圖文訊息</div>}{assets.richMessages.map(x=><div className="asset-record" key={x.id}><img src={x.image} alt=""/><div><strong>{x.name}</strong><small>已建立・可用於群發</small></div><button onClick={()=>{setRich({...x,actions:x.actions.map(a=>({...a}))});setPage('edit');}}>編輯</button></div>)}</>:assets.reward?<div className="official-form-section"><h3>已公開的集點卡（模擬）</h3><p>集滿 {assets.reward.goal} 點</p><p>滿點禮：{assets.coupons.find(x=>x.id===assets.reward?.couponId)?.name||'未設定'}</p><p>{assets.reward.expiry}</p></div>:<div className="official-empty-center">尚未建立集點卡</div>)}
 {page==='type'&&<div className="coupon-type-list">{['無條件','抽獎','好友介紹'].map(type=><button key={type} onClick={()=>{setCoupon(newCoupon(type));setPage('edit');}}><span>{type}</span><div><strong>{type}</strong><span>{type==='無條件'?'取得連結即可領取':type==='抽獎'?'抽獎中獎後領取':'分享給好友後領取'}</span></div><span>›</span></button>)}</div>}
 {page==='edit'&&kind==='coupon'&&<>
 <section className="official-form-section"><h3>{coupon.type}優惠券</h3><label>優惠券名稱<input aria-label="優惠券名稱" maxLength={60} value={coupon.name} onChange={e=>changeCoupon({name:e.target.value})}/></label><label>開始日期<input type="date" value={coupon.start} onChange={e=>changeCoupon({start:e.target.value})}/></label><label>結束日期<input type="date" value={coupon.end} onChange={e=>changeCoupon({end:e.target.value})}/></label><label>主要圖片<input aria-label="優惠券圖片" type="file" accept="image/png,image/jpeg" disabled={busy} onChange={e=>void upload(e.target.files?.[0],false)}/></label>{coupon.image&&<img className="asset-upload-preview" src={coupon.image} alt="優惠券預覽"/>}<label>優惠券詳情<textarea maxLength={500} value={coupon.details} onChange={e=>changeCoupon({details:e.target.value})}/></label></section>
 <section className="official-form-section"><h3>進階設定</h3><label className="official-switch-row"><span>刊登至 LY 服務</span><input type="checkbox" checked={coupon.publicListing} onChange={e=>changeCoupon({publicListing:e.target.checked})}/></label><label>使用次數<select value={coupon.singleUse?'one':'many'} onChange={e=>changeCoupon({singleUse:e.target.value==='one'})}><option value="one">一次</option><option value="many">多次</option></select></label><label>優惠券序號（選填）<input value={coupon.code} onChange={e=>changeCoupon({code:e.target.value})}/></label><label>使用條件<textarea value={coupon.condition} onChange={e=>changeCoupon({condition:e.target.value})}/></label>{coupon.type==='抽獎'&&<><label>中獎機率 (%)<input type="number" min={1} max={100} value={coupon.chance} onChange={e=>changeCoupon({chance:e.target.value})}/></label><label>中獎人數上限<input type="number" min={1} value={coupon.winnerLimit} onChange={e=>changeCoupon({winnerLimit:e.target.value})}/></label></>}{coupon.type==='好友介紹'&&<label>介紹好友數（教學模擬）<input type="number" min={1} value={coupon.referrals} onChange={e=>changeCoupon({referrals:e.target.value})}/></label>}</section>
 </>}
 {page==='edit'&&kind==='richmessage'&&<>
 <section className="official-form-section"><label>標題<input aria-label="圖文訊息標題" maxLength={30} value={rich.name} onChange={e=>changeRich({name:e.target.value})}/></label><h3>版型</h3><div className="rich-asset-grid">{richLayouts.map(l=><button aria-label={l.name} className={rich.template===l.id?'active':''} key={l.id} onClick={()=>changeRich({template:l.id,actions:l.areas.map(()=>({type:'連結',value:'',label:''}))})}>{l.areas.map(([x,y,w,h],i)=><span key={i} style={{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'}}/>)}</button>)}</div><label>圖片（1040 × 1040 px）<input type="file" accept="image/png,image/jpeg" disabled={busy} onChange={e=>void upload(e.target.files?.[0],true)}/></label><div className="rich-asset-preview">{rich.image&&<img src={rich.image} alt="圖文訊息預覽"/>}{layout.areas.map(([x,y,w,h],i)=><span key={i} style={{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'}}>{String.fromCharCode(65+i)}</span>)}</div></section>
 {rich.actions.map((a,i)=><section className="official-form-section" key={i}><h3>動作 {String.fromCharCode(65+i)}</h3><select value={a.type} onChange={e=>setArea(i,{type:e.target.value as '連結'|'優惠券',value:''})}><option>連結</option><option>優惠券</option></select>{a.type==='連結'?<input placeholder="https://example.com" value={a.value} onChange={e=>setArea(i,{value:e.target.value})}/>:<select value={a.value} onChange={e=>setArea(i,{value:e.target.value})}><option value="">請先選擇已建立的優惠券</option>{couponOptions}</select>}<label>動作說明<input maxLength={100} value={a.label} onChange={e=>setArea(i,{label:e.target.value})}/></label></section>)}
 </>}
 {page==='edit'&&kind==='stampcard'&&<>
 <div className="stamp-preview" style={{background:reward.color,color:'#fff'}}><div className="stamp-dots">{Array.from({length:reward.goal},(_,i)=><i key={i}/>)}</div><strong>集滿 {reward.goal} 點</strong></div>
 <section className="official-form-section"><h3>卡片顏色</h3><div className="color-swatch-row">{['#06c755','#e99b2b','#4a90e2','#e85d75','#8b63d9','#333333','#009a9a','#ba663c','#81878d','#a6ad38'].map(color=><button aria-label={'顏色 '+color} aria-pressed={color===reward.color} key={color} style={{background:color,outline:color===reward.color?'2px solid #111':undefined}} onClick={()=>changeReward({color})}/>)}</div><label>集滿點數<select value={reward.goal} onChange={e=>changeReward({goal:Number(e.target.value)})}>{[5,10,15,20].map(n=><option key={n}>{n}</option>)}</select></label><label>滿點禮優惠<select value={reward.couponId} onChange={e=>changeReward({couponId:e.target.value})}><option value="">請先建立並選擇優惠券</option>{couponOptions}</select></label><label>有效期限<select value={reward.expiry} onChange={e=>changeReward({expiry:e.target.value})}><option>最後一次使用後 6 個月</option><option>首次使用後 1 年</option><option>不設定</option></select></label></section>
 </>}
 </div>
 {page==='list'&&<div className="asset-editor-footer"><button onClick={start}>{kind==='stampcard'?(assets.reward?'編輯集點卡':'建立集點卡'):'建立'}</button></div>}
 {page==='edit'&&<div className="asset-editor-footer">{kind==='coupon'?<><button className="secondary" disabled={!coupon.name.trim()||busy} onClick={()=>saveCoupon('draft')}>儲存草稿</button><button disabled={!couponValid||busy} onClick={()=>saveCoupon('saved')}>儲存</button></>:kind==='richmessage'?<button disabled={!richValid||busy} onClick={()=>commit({richMessages:[rich,...assets.richMessages.filter(x=>x.id!==rich.id)]},'圖文訊息已儲存')}>儲存</button>:<button disabled={!usable.some(x=>x.id===reward.couponId)} onClick={()=>commit({reward:{...reward,published:true}},'集點卡已公開（僅本機模擬）')}>儲存並公開集點卡</button>}</div>}
 </div>;
}
