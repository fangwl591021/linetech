import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,QrCode,Copy,UserPlus} from 'lucide-react';
import QRCode from 'qrcode';
import {friendCardArt} from './friendCardArt';
import {extraFriendArt} from './friendExtraArt';
import {FriendExtraPractice,readShareSettings,saveShareSettings} from './FriendExtraPractice';
import {AssetEditors} from './AssetEditors';
import {useAssets,usableCoupons} from './trainingAssets';
import {useTraining,welcomeText} from './trainingState';

export type FriendTool='guide'|'poster'|'stamp'|'friend'|'coupon'|'ad'|'url'|'button'|'referral'|'template'|'line'|'instagram'|'facebook'|'x'|'email'|'image';
const artwork={...friendCardArt,...extraFriendArt};
export const sharePlatforms=[{id:'line',title:'LINE'},{id:'instagram',title:'Instagram 限時動態'},{id:'facebook',title:'Facebook'},{id:'x',title:'X（舊稱：Twitter）'},{id:'email',title:'電子郵件'}] as const;
const extraTools:FriendTool[]=['ad','url','button','referral','template','line','instagram','facebook','x','email','image'];
const cards=[
 {id:'poster',title:'建立海報',description:'您可以建立張貼在店鋪內的宣傳海報。'},
 {id:'stamp',title:'建立集點卡',description:'可以在發行集點卡時，鼓勵顧客將您加入好友。'},
 {id:'friend',title:'建立加入好友行動條碼',description:'您可以建立加入好友用的行動條碼。'},
 {id:'coupon',title:'建立優惠券行動條碼',description:'建立可顯示店家優惠券及加入好友的行動條碼。'},
 {id:'ad',title:'建立加好友廣告',description:'在LINE上刊登官方帳號的廣告，吸引用戶將您加入好友！'},
 {id:'url',title:'建立網址',description:'您可以建立加入好友用的網址。'},
 {id:'button',title:'建立按鍵',description:'您可以建立設置在網站或部落格上的「加入好友」鍵。'},
 {id:'referral',title:'建立好友推薦優惠券',description:'可建立吸引用戶之間互相加入好友的好友推薦優惠券。'}
] as const;
const manual='https://tw.linebiz.com/manual/line-official-account/oa-manager-addfriend/';
export const titleFor=(tool:FriendTool)=>tool==='guide'?'增加好友人數所需的3大要素':tool==='template'?'選用訊息範本':tool==='image'?'選擇分享用的圖片':cards.find(x=>x.id===tool)?.title||sharePlatforms.find(x=>x.id===tool)?.title||'增加好友人數';
export function FriendGrowthPage({tool,onSelect,onBack}:{tool:FriendTool|null;onSelect:(tool:FriendTool|null)=>void;onBack:()=>void}){
 const scrollRef=useRef<HTMLDivElement>(null),lastScroll=useRef(0);
 useLayoutEffect(()=>{if(tool===null&&scrollRef.current)scrollRef.current.scrollTop=lastScroll.current;},[tool]);
 const openTool=(next:FriendTool)=>{if(scrollRef.current)lastScroll.current=scrollRef.current.scrollTop;onSelect(next);};
 const card=(item:typeof cards[number])=><button className="friend-growth-card" key={item.id} onClick={()=>openTool(item.id)}><img src={artwork[item.id]} alt="" /><strong>{item.title}</strong><span>{item.description}</span></button>;
 if(tool==='stamp')return <AssetEditors kind="stampcard" onBack={()=>onSelect(null)}/>;
 return <div className="oa-mobile-screen friend-growth-screen">
 <div className="auto-tw-status friend-status" aria-hidden="true"><span>07:19</span><span>▂▄▆▇ 5G ▰</span></div>
 <div className="oa-mobile-header"><button aria-label="返回" onClick={()=>tool?onSelect(null):onBack()}><ChevronLeft size={28}/></button><strong>{tool?titleFor(tool):'增加好友人數'}</strong><span/></div>
 {tool===null?<div key="friend-landing" className="friend-growth-scroll" ref={scrollRef} tabIndex={0} aria-label="增加好友人數可捲動內容" onScroll={e=>{lastScroll.current=e.currentTarget.scrollTop;}}>
 <button className="friend-growth-guide" onClick={()=>openTool('guide')}><span>增加好友人數所需的3大要素</span><i/><ChevronRight size={19}/></button>
 <section className="friend-growth-section"><h3>店頭宣傳</h3><div className="friend-growth-grid">{cards.slice(0,2).map(card)}</div></section>
 <section className="friend-growth-section"><h3>線上宣傳</h3><div className="friend-growth-grid">{cards.slice(2).map(card)}</div><button className="friend-template-button" onClick={()=>openTool('template')}>選用訊息範本</button></section>
 <section className="friend-share-section"><h3>透過社群及電子郵件分享</h3><div className="friend-share-grid">{sharePlatforms.map(item=><button key={item.id} className="friend-share-card" onClick={()=>openTool(item.id)}><span><img src={extraFriendArt[item.id]} alt=""/></span><strong>{item.title}</strong></button>)}</div></section>
 <section className="friend-setting-section"><h3>設定</h3><button onClick={()=>openTool('image')}>選擇分享用的圖片<ChevronRight size={19}/></button></section>
 </div>:<div key="friend-detail" className="friend-growth-scroll friend-growth-detail">
 <p className="friend-unverified">Linetech 教學練習・此子頁尚未取得台灣實機畫面</p>
 {tool==='guide'?<><h3>增加好友的實作方向</h3><ol><li>提高行動條碼曝光。</li><li>提供好友加入的誘因。</li><li>搭配歡迎訊息建立後續互動。</li></ol><p>以上為教學整理，非官方三大要素頁面的逐字內容。</p></>:<>{tool in artwork&&<img className="friend-detail-art" src={artwork[tool as keyof typeof artwork]} alt="功能參考圖"/>}<h3>{titleFor(tool)}</h3><p>請在右側教學區完成「{titleFor(tool)}」的實作練習。</p></>}
 <a href={manual} target="_blank" rel="noreferrer">LINE 台灣官方操作手冊</a>
 <button className="friend-green-button" onClick={()=>onSelect(null)}>返回增加好友人數</button>
 </div>}
 </div>;
}

export function FriendGrowthPractice({tool,onSelect,onCoupon}:{tool:FriendTool|null;onSelect:(tool:FriendTool|null)=>void;onCoupon:()=>void}){
 const training=useTraining(),assets=useAssets();
 const [headline,setHeadline]=useState(()=>readShareSettings().headline);
 const [couponId,setCouponId]=useState(()=>readShareSettings().couponId);
 const [qr,setQr]=useState('');
 const [error,setError]=useState('');
 const [followed,setFollowed]=useState(false);
 const [copyResult,setCopyResult]=useState('');
 useEffect(()=>{if(!saveShareSettings({headline,couponId}))setError('教學設定儲存失敗');},[headline,couponId]);
 const coupons=usableCoupons(assets);
 const coupon=coupons.find(x=>x.id===couponId);
 const eligible=tool==='friend'||tool==='poster'||(tool==='coupon'&&Boolean(coupon));
 const demoUrl='https://example.invalid/linetech/'+(tool==='coupon'?'coupon/'+encodeURIComponent(couponId):'friend');
 useEffect(()=>{setQr('');setError('');setFollowed(false);setCopyResult('');if(!eligible)return;let active=true;QRCode.toDataURL(demoUrl,{width:240,margin:2,color:{dark:tool==='poster'?'#06a849':'#121212',light:'#ffffff'}}).then(url=>{if(active)setQr(url);}).catch(()=>{if(active)setError('教學行動條碼產生失敗');});return()=>{active=false;};},[tool,demoUrl,eligible]);
 const copy=async()=>{try{await navigator.clipboard.writeText(demoUrl);setCopyResult('已複製教學網址');}catch{setCopyResult('無法使用剪貼簿，請手動選取網址');}};
 const download=()=>{if(!qr)return;const a=document.createElement('a');a.href=qr;a.download='linetech-demo-qr.png';a.click();};
 const posterDownload=()=>{if(!qr)return;const canvas=document.createElement('canvas');canvas.width=720;canvas.height=960;const ctx=canvas.getContext('2d');if(!ctx)return;const img=new Image();img.onload=()=>{ctx.fillStyle='#06c755';ctx.fillRect(0,0,720,960);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 38px sans-serif';ctx.fillText(headline,360,140,640);ctx.font='28px sans-serif';ctx.fillText('康立全球智能系統',360,205);ctx.drawImage(img,120,270,480,480);ctx.font='24px sans-serif';ctx.fillText('教學範例・非正式加入好友網址',360,860);const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='linetech-demo-poster.png';a.click();};img.src=qr;};
 return <div className="friend-practice"><h2>增加好友人數｜{tool?titleFor(tool):'操作與測試'}</h2><p>左側入口依台灣 iOS 實機截圖；右側是 Linetech 教學擴充，非 LINE 官方畫面。</p>
 {tool&&extraTools.includes(tool)?<FriendExtraPractice tool={tool} onSelect={onSelect} onCoupon={onCoupon}/>:tool===null?<div className="friend-practice-intro"><h3>依宣傳場景選擇工具</h3>{cards.map(x=><button key={x.id} onClick={()=>onSelect(x.id)}><strong>{x.title}</strong><small>{x.description}</small></button>)}<button onClick={()=>onSelect('template')}>選用訊息範本</button><button onClick={()=>onSelect('image')}>選擇分享用的圖片</button></div>:tool==='guide'?<div className="mobile-teaching-note"><strong>實作目標</strong><span>選擇宣傳入口、提供加入好友誘因、測試歡迎訊息。實際官方三大要素內容尚待核對。</span></div>:tool==='stamp'?<div className="mobile-teaching-note"><strong>集點卡目前狀態</strong><span>{assets.reward?.published?'已建立本機集點卡：集滿 '+assets.reward.goal+' 點':'尚未公開集點卡，請使用左側設定'}</span></div>:<>
 {tool==='poster'&&<label className="friend-practice-label">海報標語<input maxLength={24} value={headline} onChange={e=>setHeadline(e.target.value)}/></label>}
 {tool==='coupon'&&<><label className="friend-practice-label">選擇已建立的優惠券<select value={couponId} onChange={e=>setCouponId(e.target.value)}><option value="">請選擇優惠券</option>{coupons.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>{!coupons.length&&<button className="friend-green-button" onClick={onCoupon}>前往建立優惠券</button>}{coupon&&<div className="friend-coupon-preview"><img src={coupon.image} alt="優惠券"/><strong>{coupon.name}</strong><small>{coupon.start} ～ {coupon.end}</small></div>}</>}
 {qr&&<><div className={'friend-qr-preview '+(tool==='poster'?'poster':'')}>{tool==='poster'&&<strong>{headline}</strong>}<span>康立全球智能系統</span><img src={qr} alt="教學行動條碼"/><small>教學範例・非真實 LINE 加好友網址</small></div><label className="friend-practice-label">教學網址<input readOnly value={demoUrl}/></label><div className="friend-practice-buttons"><button onClick={copy}><Copy size={15}/> 複製教學網址</button><button onClick={tool==='poster'?posterDownload:download}>{tool==='poster'?'儲存教學海報':'儲存教學行動條碼'}</button></div>{copyResult&&<p role="status">{copyResult}</p>}</>}
 {error&&<p role="alert">{error}</p>}
 </>}
 {tool&&tool!=='guide'&&(tool==='stamp'?assets.reward?.published:eligible&&qr)&&<div className="friend-follow-preview"><div className="friend-preview-account"><span>K</span><strong>康立全球智能系統</strong></div><button className="friend-green-button" disabled={followed} onClick={()=>setFollowed(true)}><UserPlus size={18}/>{followed?'已模擬加入好友':'模擬加入好友'}</button>{followed&&<div className="friend-welcome-preview">{training.welcomeEnabled?training.welcome.map((m,i)=><p key={i}>{welcomeText(m)}</p>):<p>歡迎訊息目前停用</p>}{tool==='coupon'&&coupon&&<p>已顯示優惠券：{coupon.name}</p>}</div>}<small>僅在瀏覽器模擬，不會增加真實好友人數。</small></div>}
 <div className="mobile-teaching-note"><strong>畫面來源與範圍</strong><span>RC7.1：八張宣傳圖卡、五個分享入口、分享圖片設定已納入。左側手機可向下捲動至「設定」。子頁仍待實機核對，右側為本機教學模擬。</span><a href={manual} target="_blank" rel="noreferrer">台灣官方手冊</a><a href="https://www.lycbiz.com/jp/manual/OfficialAccountManager/gain-friends/" target="_blank" rel="noreferrer">日本官方 App 流程參考</a></div>
 </div>;
}
