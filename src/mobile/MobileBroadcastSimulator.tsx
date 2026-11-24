import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Image as ImageIcon,
  Mic,
  MessageCircle,
  PlaySquare,
  Plus,
  Send,
  Smile,
  Ticket,
  X
} from 'lucide-react';

type BroadcastPage = 'create' | 'settings';
type FormatType =
  | '文字'
  | '貼圖'
  | '照片'
  | '優惠券'
  | '圖文訊息'
  | '進階影片訊息'
  | '影片'
  | '語音訊息'
  | '問卷調查'
  | '多頁訊息';

interface Props {
  onBack: () => void;
}

interface MessageBlock {
  id: number;
  type: FormatType;
  text: string;
  open: boolean;
}

const formats: Array<{ type: FormatType; icon: typeof MessageCircle }> = [
  { type: '文字', icon: MessageCircle },
  { type: '貼圖', icon: Smile },
  { type: '照片', icon: ImageIcon },
  { type: '優惠券', icon: Ticket },
  { type: '圖文訊息', icon: MessageCircle },
  { type: '進階影片訊息', icon: PlaySquare },
  { type: '影片', icon: PlaySquare },
  { type: '語音訊息', icon: Mic },
  { type: '問卷調查', icon: MessageCircle },
  { type: '多頁訊息', icon: MessageCircle }
];

export function MobileBroadcastSimulator({ onBack }: Props) {
  const [page, setPage] = useState<BroadcastPage>('create');
  const [pickerOpen, setPickerOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [messages, setMessages] = useState<MessageBlock[]>([]);
  const [nextId, setNextId] = useState(1);
  const [audience, setAudience] = useState<'所有好友' | '依屬性篩選'>('所有好友');
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limitCount, setLimitCount] = useState('50');
  const [postToFeed, setPostToFeed] = useState(false);
  const [sendNow, setSendNow] = useState(true);
  const [toast, setToast] = useState('');

  const canAdd = messages.length < 3;
  const canNext = messages.length > 0;
  const totalChars = useMemo(
    () => messages.filter(m => m.type === '文字').reduce((sum, m) => sum + m.text.length, 0),
    [messages]
  );

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };

  const addFormat = (type: FormatType) => {
    if (!canAdd) {
      flash('最多可新增 3 則訊息');
      setPickerOpen(false);
      return;
    }
    setMessages(items => [
      ...items,
      {
        id: nextId,
        type,
        text: type === '文字' ? '' : '',
        open: true
      }
    ]);
    setNextId(id => id + 1);
    setPickerOpen(false);
  };

  const updateMessage = (id: number, patch: Partial<MessageBlock>) => {
    setMessages(items => items.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const removeMessage = (id: number) => {
    setMessages(items => items.filter(item => item.id !== id));
  };

  const send = () => {
    flash('群發訊息已傳送（教學模擬）');
    window.setTimeout(onBack, 850);
  };

  return (
    <div className="oa-mobile-screen broadcast-official-screen">
      {page === 'create' ? (
        <>
          <div className="broadcast-official-header">
            <button onClick={onBack}><ChevronLeft size={28}/></button>
            <strong>建立</strong>
            <button className="broadcast-preview-link" onClick={() => setPreviewOpen(true)}>預覽</button>
          </div>

          <div className="broadcast-create-canvas">
            {messages.map((message, index) => (
              <section className="broadcast-official-message" key={message.id}>
                <div className="broadcast-official-message-head">
                  <span>{message.type}</span>
                  <div>
                    <button onClick={() => updateMessage(message.id, { open: !message.open })}>
                      {message.open ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                    <button onClick={() => removeMessage(message.id)}><X size={18}/></button>
                  </div>
                </div>

                {message.open && (
                  <div className="broadcast-official-message-body">
                    {message.type === '文字' ? (
                      <>
                        <textarea
                          maxLength={500}
                          placeholder="輸入文字"
                          value={message.text}
                          onChange={e => updateMessage(message.id, { text: e.target.value })}
                        />
                        <div className="broadcast-char-count">{message.text.length}/500</div>
                        <button className="broadcast-emoji-btn"><Smile size={16}/> 表情貼</button>
                      </>
                    ) : (
                      <div className="broadcast-format-placeholder">
                        <FormatIcon type={message.type}/>
                        <strong>{message.type}</strong>
                        <span>{formatHelper(message.type)}</span>
                        <button onClick={() => flash(`${message.type} 選擇畫面（教學模擬）`)}>選擇</button>
                      </div>
                    )}
                  </div>
                )}
                <small className="broadcast-message-index">訊息 {index + 1}</small>
              </section>
            ))}

            {messages.length === 0 && (
              <div className="broadcast-empty-create">
                <span>請點選「＋ 新增」選擇訊息格式</span>
              </div>
            )}

            <button className="broadcast-add-btn" disabled={!canAdd} onClick={() => setPickerOpen(true)}>
              <Plus size={20}/> 新增
            </button>
          </div>

          <div className="broadcast-create-bottom">
            <button className="broadcast-next-btn" disabled={!canNext} onClick={() => setPage('settings')}>下一步</button>
            <button className="broadcast-draft-btn" onClick={() => flash('已儲存草稿（教學模擬）')}>儲存草稿</button>
          </div>

          {pickerOpen && (
            <div className="broadcast-format-overlay">
              <div className="broadcast-format-sheet">
                <div className="broadcast-format-title">建立</div>
                <div className="broadcast-format-list">
                  {formats.map(({ type, icon: Icon }) => (
                    <button key={type} onClick={() => addFormat(type)}>
                      <Icon size={19}/>
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
                <button className="broadcast-cancel-picker" onClick={() => setPickerOpen(false)}>取消</button>
              </div>
            </div>
          )}

          {previewOpen && (
            <div className="broadcast-preview-overlay">
              <div className="broadcast-preview-phone">
                <div className="broadcast-preview-head">
                  <button onClick={() => setPreviewOpen(false)}><X size={20}/></button>
                  <strong>預覽</strong>
                  <span/>
                </div>
                <div className="broadcast-preview-chat">
                  {messages.map(message => (
                    <div key={message.id} className="broadcast-preview-bubble">
                      {message.type === '文字'
                        ? (message.text || '輸入文字')
                        : `[${message.type}]`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="broadcast-official-header">
            <button onClick={() => setPage('create')}><ChevronLeft size={28}/></button>
            <strong>群發訊息設定</strong>
            <span/>
          </div>

          <div className="broadcast-settings-official">
            <section>
              <h3>群發訊息設定</h3>
              <label className="broadcast-setting-switch">
                <span>同步張貼至貼文串</span>
                <input type="checkbox" checked={postToFeed} onChange={e => setPostToFeed(e.target.checked)}/>
              </label>
              <label className="broadcast-setting-switch">
                <span>指定群發訊息則數</span>
                <input type="checkbox" checked={limitEnabled} onChange={e => setLimitEnabled(e.target.checked)}/>
              </label>
              {limitEnabled && (
                <div className="broadcast-limit-input">
                  <span>群發訊息則數</span>
                  <input type="number" min="1" value={limitCount} onChange={e => setLimitCount(e.target.value)}/>
                </div>
              )}
            </section>

            <section>
              <h3>傳送對象</h3>
              <label className="broadcast-radio">
                <input type="radio" checked={audience === '所有好友'} onChange={() => setAudience('所有好友')}/>
                <span>所有好友</span>
              </label>
              <label className="broadcast-radio">
                <input type="radio" checked={audience === '依屬性篩選'} onChange={() => setAudience('依屬性篩選')}/>
                <span>依屬性篩選</span>
              </label>
              {audience === '依屬性篩選' && (
                <div className="broadcast-filter-note">依屬性篩選需符合官方目標好友數條件。</div>
              )}
            </section>

            <section>
              <h3>傳送時間</h3>
              <label className="broadcast-radio">
                <input type="radio" checked={sendNow} onChange={() => setSendNow(true)}/>
                <span>立即傳送</span>
              </label>
              <label className="broadcast-radio">
                <input type="radio" checked={!sendNow} onChange={() => setSendNow(false)}/>
                <span>預約傳送</span>
              </label>
              {!sendNow && <input className="broadcast-date-input" type="datetime-local"/>}
            </section>

            <div className="broadcast-setting-summary">
              <span>訊息 {messages.length} 則</span>
              <span>文字字數 {totalChars}</span>
              <span>對象：{audience}</span>
            </div>
          </div>

          <div className="broadcast-settings-actions">
            <button onClick={() => flash('已儲存草稿（教學模擬）')}>儲存草稿</button>
            <button onClick={() => flash('已開啟測試訊息設定（教學模擬）')}>傳送測試訊息</button>
            <button className="send" onClick={send}><Send size={16}/> 傳送</button>
          </div>
        </>
      )}

      {toast && <div className="feature-toast">{toast}</div>}
    </div>
  );
}

function FormatIcon({ type }: { type: FormatType }) {
  if (type === '照片') return <ImageIcon size={42}/>;
  if (type === '優惠券') return <Ticket size={42}/>;
  if (type === '影片' || type === '進階影片訊息') return <PlaySquare size={42}/>;
  if (type === '語音訊息') return <Mic size={42}/>;
  if (type === '貼圖') return <Smile size={42}/>;
  return <MessageCircle size={42}/>;
}

function formatHelper(type: FormatType) {
  if (type === '照片') return '從手機選擇照片';
  if (type === '優惠券') return '選擇已建立的優惠券';
  if (type === '圖文訊息') return '選擇已建立的圖文訊息';
  if (type === '進階影片訊息') return '選擇已建立的進階影片訊息';
  if (type === '影片') return '選擇影片檔案';
  if (type === '語音訊息') return '選擇語音檔案';
  if (type === '問卷調查') return '選擇已建立的問卷';
  if (type === '多頁訊息') return '選擇已建立的多頁訊息';
  return '選擇內容';
}
