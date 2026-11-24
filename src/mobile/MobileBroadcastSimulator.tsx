import { useMemo, useState } from 'react';
import { ChevronLeft, Eye, Image as ImageIcon, MessageCircle, Plus, Send, Sticker, X } from 'lucide-react';

type BroadcastPage = 'list' | 'compose' | 'settings';

interface Props {
  onBack: () => void;
}

type MessageBlock = {
  id: number;
  type: '文字' | '照片' | '圖文訊息';
  content: string;
};

export function MobileBroadcastSimulator({ onBack }: Props) {
  const [page, setPage] = useState<BroadcastPage>('list');
  const [messages, setMessages] = useState<MessageBlock[]>([]);
  const [nextId, setNextId] = useState(1);
  const [audience, setAudience] = useState('所有好友');
  const [specifiedCount, setSpecifiedCount] = useState(false);
  const [count, setCount] = useState('50');
  const [syncPost, setSyncPost] = useState(false);
  const [toast, setToast] = useState('');

  const messageFormats = ['文字','貼圖','照片','優惠券','圖文訊息','圖文選單','多頁訊息','影片','語音訊息','位置資訊'];
  const canNext = messages.length > 0;
  const usedCharacters = useMemo(() => messages.filter(m => m.type === '文字').reduce((sum,m)=>sum+m.content.length,0),[messages]);

  const flash=(msg:string)=>{
    setToast(msg);
    window.setTimeout(()=>setToast(''),1800);
  };

  const addMessage = (type: MessageBlock['type']) => {
    if (messages.length >= 3) {
      flash('群發訊息最多可新增 3 則訊息');
      return;
    }
    const defaultContent = type === '文字' ? '輸入要傳送的文字內容' : type === '照片' ? '照片預覽' : '圖文訊息預覽';
    setMessages(items => [...items,{id:nextId,type,content:defaultContent}]);
    setNextId(id=>id+1);
  };

  const removeMessage=(id:number)=>setMessages(items=>items.filter(x=>x.id!==id));

  const send = () => {
    flash('群發訊息已送出（教學模擬）');
    window.setTimeout(()=>setPage('list'),800);
  };

  return (
    <div className="oa-mobile-screen broadcast-sim">
      {page === 'list' && (
        <>
          <BroadcastHeader title="群發訊息" onBack={onBack} />
          <div className="broadcast-list-wrap">
            <div className="broadcast-usage-card">
              <div><span>本月訊息用量</span><strong>9 / 200</strong></div>
              <button onClick={()=>flash('前往分析（教學模擬）')}>查看詳情</button>
            </div>
            <button className="broadcast-create" onClick={()=>setPage('compose')}><Plus size={20}/> 建立新訊息</button>
            <div className="broadcast-status-tabs"><button className="active">全部</button><button>已預約</button><button>草稿</button><button>已傳送</button></div>
            <div className="broadcast-empty">
              <MessageCircle size={46}/>
              <strong>尚無群發訊息</strong>
              <span>點選「建立新訊息」開始製作。</span>
            </div>
          </div>
        </>
      )}

      {page === 'compose' && (
        <>
          <BroadcastHeader title="建立群發訊息" onBack={()=>setPage('list')} />
          <div className="broadcast-compose-wrap">
            <div className="broadcast-step-label">訊息內容</div>
            <div className="broadcast-format-grid">
              {messageFormats.map((format,index)=>(
                <button key={format} onClick={()=>{
                  if (format==='文字') addMessage('文字');
                  else if (format==='照片') addMessage('照片');
                  else if (format==='圖文訊息') addMessage('圖文訊息');
                  else flash(format+'：此格式將於後續模組補上');
                }}>
                  {index===0?<MessageCircle/>:index===1?<Sticker/>:<ImageIcon/>}
                  <span>{format}</span>
                </button>
              ))}
            </div>

            <div className="broadcast-message-stack">
              {messages.map((m,idx)=>(
                <div className="broadcast-message-card" key={m.id}>
                  <div className="broadcast-message-head"><strong>{idx+1}. {m.type}</strong><button onClick={()=>removeMessage(m.id)}><X size={17}/></button></div>
                  {m.type==='文字' ? (
                    <textarea maxLength={500} value={m.content} onChange={e=>setMessages(items=>items.map(x=>x.id===m.id?{...x,content:e.target.value}:x))}/>
                  ) : (
                    <div className="broadcast-media-preview">{m.content}</div>
                  )}
                </div>
              ))}
              {messages.length===0 && <div className="broadcast-hint">請從上方選擇訊息格式，最多可新增 3 則。</div>}
            </div>

            <div className="broadcast-preview-box">
              <div className="broadcast-preview-title"><Eye size={16}/> 預覽</div>
              <div className="broadcast-chat-preview">
                {messages.map(m=><div key={m.id} className="broadcast-preview-bubble">{m.type==='文字'?m.content:m.content}</div>)}
              </div>
              <small>文字字數：{usedCharacters}</small>
            </div>
          </div>
          <div className="broadcast-bottom-actions">
            <button className="secondary" onClick={()=>flash('已儲存草稿')}>儲存草稿</button>
            <button className="primary" disabled={!canNext} onClick={()=>setPage('settings')}>下一步</button>
          </div>
        </>
      )}

      {page === 'settings' && (
        <>
          <BroadcastHeader title="群發訊息設定" onBack={()=>setPage('compose')} />
          <div className="broadcast-settings-wrap">
            <section className="broadcast-setting-card">
              <h3>傳送對象</h3>
              <label><input type="radio" checked={audience==='所有好友'} onChange={()=>setAudience('所有好友')}/> 所有好友</label>
              <label><input type="radio" checked={audience==='依屬性篩選'} onChange={()=>setAudience('依屬性篩選')}/> 依屬性篩選</label>
              {audience==='依屬性篩選' && <div className="broadcast-filter-note">目標好友數需符合 LINE 官方分眾條件才可使用。</div>}
            </section>

            <section className="broadcast-setting-card">
              <h3>群發訊息則數</h3>
              <label className="broadcast-switch-line"><span>指定群發訊息則數</span><input type="checkbox" checked={specifiedCount} onChange={e=>setSpecifiedCount(e.target.checked)}/></label>
              {specifiedCount && <input type="number" min="1" value={count} onChange={e=>setCount(e.target.value)} />}
            </section>

            <section className="broadcast-setting-card">
              <h3>其他設定</h3>
              <label className="broadcast-switch-line"><span>同步張貼至貼文串</span><input type="checkbox" checked={syncPost} onChange={e=>setSyncPost(e.target.checked)}/></label>
            </section>

            <section className="broadcast-summary">
              <strong>傳送摘要</strong>
              <span>訊息：{messages.length} 則</span>
              <span>對象：{audience}</span>
              <span>{specifiedCount ? '指定則數：'+count : '未指定群發則數'}</span>
            </section>
          </div>
          <div className="broadcast-bottom-actions triple">
            <button className="secondary" onClick={()=>flash('已儲存草稿')}>儲存草稿</button>
            <button className="secondary" onClick={()=>flash('測試訊息已送出（模擬）')}>傳送測試</button>
            <button className="primary" onClick={send}><Send size={16}/> 傳送</button>
          </div>
        </>
      )}

      {toast && <div className="feature-toast">{toast}</div>}
    </div>
  );
}

function BroadcastHeader({title,onBack}:{title:string;onBack:()=>void}) {
  return (
    <div className="oa-mobile-header">
      <button className="mobile-back" onClick={onBack}><ChevronLeft size={28}/></button>
      <strong>{title}</strong>
      <span className="mobile-header-spacer"/>
    </div>
  );
}
