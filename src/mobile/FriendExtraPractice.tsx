import {useState,useEffect} from 'react';
import type {FriendTool} from './FriendGrowthPage';
import {useAssets,usableCoupons,readImage} from './trainingAssets';
import {useTraining,welcomeText} from './trainingState';

const KEY='linetech.friend.share.v1';
const DEMO_URL='https://example.invalid/linetech/friend';
const samples=['加入好友，掌握最新消息！','歡迎加入官方帳號，了解最新服務。','邀請好友一起加入，分享好康資訊。'];
export interface ShareSettings {headline:string;couponId:string;message:string;image:string;subject:string;adTitle:string;adBody:string;referralId:string;campaign:string;}
const defaults:ShareSettings={headline:'加入好友，掌握最新資訊',couponId:'',message:samples[0],image:'',subject:'邀請您加入好友',adTitle:'加入好友',adBody:'掌握最新資訊與優惠',referralId:'',campaign:''};
export function readShareSettings():ShareSettings{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return {...defaults};}}
export function saveShareSettings(patch:Partial<ShareSettings>):boolean{try{localStorage.setItem(KEY,JSON.stringify({...readShareSettings(),...patch}));return true;}catch{return false;}}
const escapeHtml=(text:string)=>text.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]||ch));
export function FriendExtraPractice({tool,onSelect,onCoupon}:{tool:FriendTool;onSelect:(tool:FriendTool|null)=>void;onCoupon:()=>void}){
 const assets=useAssets(),training=useTraining();
 const [data,setData]=useState(readShareSettings);
 const [feedback,setFeedback]=useState('');
 const [busy,setBusy]=useState(false);
 const [shared,setShared]=useState(false);
 const [followed,setFollowed]=useState(false);
 const [referrals,setReferrals]=useState(0);
 const [claimed,setClaimed]=useState(false);
 useEffect(()=>{setData(readShareSettings());setFeedback('');setShared(false);setFollowed(false);setReferrals(0);setClaimed(false);},[tool]);
 const update=(p:Partial<ShareSettings>)=>{if(saveShareSettings(p)){setData(v=>({...v,...p}));setFeedback('');}else setFeedback('無法儲存，請檢查本機儲存空間');};
 const demoUrl=DEMO_URL+(data.campaign.trim()?'?campaign='+encodeURIComponent(data.campaign.trim()):'');
 const copy=async(value:string)=>{try{await navigator.clipboard.writeText(value);setFeedback('已複製教學內容');}catch{setFeedback('剪貼簿無法使用，請手動選取內容');}};
 const upload=async(file?:File)=>{if(!file)return;setBusy(true);try{update({image:await readImage(file,2*1024*1024)});}catch(e){setFeedback(e instanceof Error?e.message:'讀取圖片失敗');}finally{setBusy(false);}};
 const referral=usableCoupons(assets).find(c=>c.id===data.referralId&&c.type==='好友介紹');
 const referralOptions=usableCoupons(assets).filter(c=>c.type==='好友介紹');
 const share=['line','instagram','facebook','x','email'].includes(tool);
 const sharedText=data.message+'\n'+demoUrl;
 const buttonHtml='<a href="'+escapeHtml(demoUrl)+'" style="display:inline-block;background:#06c755;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;">加入好友</a>';
 const imgPreview=data.image?<img className="friend-shared-image" src={data.image} alt="分享圖片預覽"/>:null;
 return <div className="friend-extra-practice">
 <small className="friend-unverified">本機教學工具，非 LINE 官方子頁。所有網址與分享僅供模擬。</small>
 {tool==='image'?<>
 <label className="friend-practice-label">上傳分享圖片<input aria-label="上傳分享圖片" type="file" accept="image/jpeg,image/png" disabled={busy} onChange={e=>void upload(e.target.files?.[0])}/></label>
 {imgPreview||<div className="friend-shared-placeholder">尚未選擇圖片</div>}
 {data.image&&<button className="friend-outline-button" onClick={()=>update({image:''})}>移除分享圖片</button>}
 <small>JPG／PNG，2MB 以下；選擇後自動保存於此瀏覽器。</small>
 </>:tool==='template'||share?<>
 {tool==='template'&&<div className="friend-template-list">{samples.map(s=><button key={s} aria-pressed={data.message===s} onClick={()=>update({message:s})}>{s}</button>)}</div>}
 {tool==='email'&&<label className="friend-practice-label">主旨<input maxLength={100} value={data.subject} onChange={e=>update({subject:e.target.value})}/></label>}
 <label className="friend-practice-label">分享文案<textarea aria-label="分享文案" rows={4} maxLength={500} value={data.message} onChange={e=>update({message:e.target.value})}/></label>
 <div className={'friend-social-preview '+(tool==='instagram'?'story':'')}><strong>{tool==='instagram'?'限時動態預覽':tool==='email'?data.subject:tool==='line'?'聊天室分享預覽':'分享預覽'}</strong>{imgPreview}<p>{data.message}</p><span>{demoUrl}</span></div>
 <div className="friend-practice-buttons"><button onClick={()=>void copy(tool==='email'?'主旨：'+data.subject+'\n\n'+sharedText:sharedText)}>複製分享文案</button><button onClick={()=>onSelect('image')}>選擇分享圖片</button>{share&&<button disabled={!data.message.trim()} onClick={()=>setShared(true)}>模擬分享</button>}</div>
 {shared&&<p role="status">已完成本機分享預覽，未對外傳送。</p>}
 </>:tool==='url'||tool==='button'?<>
 <label className="friend-practice-label">活動名稱（教學用）<input maxLength={60} value={data.campaign} onChange={e=>update({campaign:e.target.value})}/></label>
 <label className="friend-practice-label">教學網址<input readOnly value={demoUrl}/></label>
 <button className="friend-outline-button" onClick={()=>void copy(demoUrl)}>複製教學網址</button>
 {tool==='button'&&<><div className="friend-social-preview"><button className="friend-green-button" onClick={()=>setFollowed(true)}>加入好友</button></div><label className="friend-practice-label">按鍵 HTML<textarea readOnly rows={5} value={buttonHtml}/></label><button className="friend-outline-button" onClick={()=>void copy(buttonHtml)}>複製 HTML</button></>}
 {tool==='url'&&<button className="friend-green-button" onClick={()=>setFollowed(true)}>模擬加入好友</button>}
 {followed&&<div className="friend-welcome-preview">{training.welcomeEnabled?training.welcome.map((m,i)=><p key={i}>{welcomeText(m)}</p>):<p>歡迎訊息目前停用</p>}</div>}
 </>:tool==='ad'?<>
 <label className="friend-practice-label">廣告標題<input maxLength={50} value={data.adTitle} onChange={e=>update({adTitle:e.target.value})}/></label>
 <label className="friend-practice-label">廣告文案<textarea rows={3} value={data.adBody} onChange={e=>update({adBody:e.target.value})}/></label>
 <div className="friend-social-preview"><small>廣告練習預覽・不投放</small>{imgPreview}<strong>{data.adTitle}</strong><p>{data.adBody}</p><button className="friend-green-button" onClick={()=>setFollowed(true)}>加入好友</button></div>
 <button className="friend-outline-button" onClick={()=>onSelect('image')}>選擇廣告練習圖片</button>
 {followed&&<div className="friend-welcome-preview">{training.welcomeEnabled?training.welcome.map((m,i)=><p key={i}>{welcomeText(m)}</p>):<p>歡迎訊息目前停用</p>}</div>}
 </>:tool==='referral'?<>
 <label className="friend-practice-label">選擇好友介紹優惠券<select value={data.referralId} onChange={e=>{update({referralId:e.target.value});setReferrals(0);setClaimed(false);}}><option value="">請選擇優惠券</option>{referralOptions.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
 {!referralOptions.length&&<button className="friend-green-button" onClick={onCoupon}>前往建立優惠券</button>}
 {referral&&<div className="friend-social-preview"><img className="friend-shared-image" src={referral.image} alt="推薦優惠券"/><strong>{referral.name}</strong><p>推薦進度：{referrals} / {Number(referral.referrals)||1}</p><button className="friend-green-button" disabled={claimed||referrals>=(Number(referral.referrals)||1)} onClick={()=>setReferrals(v=>v+1)}>模擬介紹好友</button><button className="friend-outline-button" disabled={claimed||referrals<(Number(referral.referrals)||1)} onClick={()=>setClaimed(true)}>{claimed?'已模擬領取':'模擬領取優惠券'}</button></div>}
 </>:null}
 {feedback&&<p role="status">{feedback}</p>}
 </div>;
}
