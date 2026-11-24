import { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  Image as ImageIcon,
  Mic,
  MessageCircle,
  PlaySquare,
  Plus,
  Smile,
  Ticket,
  X
} from 'lucide-react';

type BroadcastPage = 'list' | 'create' | 'settings';
type FormatType =
  | '文字'
  | '照片'
  | '圖文訊息'
  | '多頁訊息'
  | '影片'
  | '優惠券'
  | '進階影片訊息'
  | '貼圖'
  | '語音訊息';

interface Props {
  onBack: () => void;
}

const formatRows: Array<Array<{ type: FormatType; icon: typeof MessageCircle }>> = [
  [
    { type: '文字', icon: MessageCircle },
    { type: '照片', icon: ImageIcon }
  ],
  [
    { type: '圖文訊息', icon: MessageCircle },
    { type: '多頁訊息', icon: ImageIcon }
  ],
  [
    { type: '影片', icon: PlaySquare },
    { type: '優惠券', icon: Ticket }
  ],
  [
    { type: '進階影片訊息', icon: PlaySquare },
    { type: '貼圖', icon: Smile }
  ],
  [
    { type: '語音訊息', icon: Mic }
  ]
];

export function MobileBroadcastSimulator({ onBack }: Props) {
  const [page, setPage] = useState<BroadcastPage>('list');
  const [status, setStatus] = useState('已預約傳送');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [slots, setSlots] = useState<Array<FormatType | null>>([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [toast, setToast] = useState('');
  const [textValues, setTextValues] = useState<Record<number, string>>({});
  const [audience, setAudience] = useState<'所有好友' | '依屬性篩選'>('所有好友');
  const [scheduled, setScheduled] = useState(false);
  const [postToFeed, setPostToFeed] = useState(false);
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limitCount, setLimitCount] = useState('50');

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1600);
  };

  const startCreate = () => {
    setPage('create');
    setActiveSlot(0);
    setPickerOpen(true);
  };

  const chooseFormat = (type: FormatType) => {
    setSlots(current => current.map((slot, index) => index === activeSlot ? type : slot));
    setPickerOpen(false);
    flash(`已選擇「${type}」`);
  };

  const openSlot = (index: number) => {
    if (index > 0 && !slots[index - 1]) return;
    setActiveSlot(index);
    setPickerOpen(true);
  };

  return (
    <div className="oa-mobile-screen broadcast-latest-screen">
      {page === 'list' ? (
        <>
          <div className="broadcast-latest-header">
            <button onClick={onBack}><ChevronLeft size={31}/></button>
            <strong>群發訊息</strong>
            <span/>
          </div>

          <div className="broadcast-latest-list">
            <label className="broadcast-status-select">
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option>已預約傳送</option>
                <option>草稿</option>
                <option>已傳送</option>
              </select>
              <ChevronDown size={18}/>
            </label>

            <div className="broadcast-list-empty">
              {status === '已預約傳送' ? '尚未預約訊息' : status === '草稿' ? '尚無草稿訊息' : '尚無已傳送訊息'}
            </div>
          </div>

          <div className="broadcast-list-bottom">
            <button onClick={startCreate}>建立新訊息</button>
          </div>
        </>
      ) : page === 'create' ? (
        <>
          <div className="broadcast-latest-header">
            <button onClick={() => setPage('list')}><ChevronLeft size={31}/></button>
            <strong>建立</strong>
            <button className="broadcast-latest-preview-link" onClick={() => setPreviewOpen(true)}>預覽</button>
          </div>

          <div className="broadcast-slot-area latest-editor">
            {slots.map((slot, index) => {
              const enabled = index === 0 || Boolean(slots[index - 1]);
              const isTextEditor = slot === '文字';
              return (
                <div className="broadcast-slot-row" key={index}>
                  <div className="broadcast-slot-avatar">K</div>
                  <div className={`broadcast-slot-card ${enabled ? 'enabled' : 'disabled'} ${activeSlot === index && pickerOpen ? 'active' : ''} ${isTextEditor ? 'editor-open' : ''}`}>
                    {slot ? (
                      isTextEditor ? (
                        <div className="broadcast-text-editor">
                          <div className="broadcast-text-editor-head">
                            <strong>文字</strong>
                            <button onClick={() => openSlot(index)}>變更</button>
                          </div>
                          <textarea
                            maxLength={500}
                            placeholder="輸入文字"
                            value={textValues[index] || ''}
                            onChange={e => setTextValues(values => ({ ...values, [index]: e.target.value }))}
                          />
                          <div className="broadcast-text-editor-foot">
                            <button onClick={() => flash('表情貼選擇（教學模擬）')}><Smile size={15}/> 表情貼</button>
                            <span>{(textValues[index] || '').length}/500</span>
                          </div>
                        </div>
                      ) : (
                        <button className="broadcast-slot-selected-btn" onClick={() => openSlot(index)}>
                          <FormatIcon type={slot}/>
                          <strong>{slot}</strong>
                          <span>點此變更</span>
                        </button>
                      )
                    ) : (
                      <button
                        className="broadcast-slot-add-button"
                        disabled={!enabled}
                        onClick={() => openSlot(index)}
                      >
                        <span className="broadcast-slot-add"><Plus size={22}/> 新增</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="broadcast-create-latest-bottom">
            <button className="broadcast-next-latest" disabled={!slots[0]} onClick={() => setPage('settings')}>下一步</button>
            <button className="broadcast-save-latest" disabled={!slots[0]} onClick={() => flash('已儲存草稿（教學模擬）')}>儲存草稿</button>
          </div>

          {pickerOpen && (
            <div className="broadcast-type-backdrop">
              <div className="broadcast-type-sheet">
                <div className="broadcast-type-sheet-head">
                  <strong>選擇訊息類型</strong>
                  <button onClick={() => setPickerOpen(false)}><X size={27}/></button>
                </div>
                <div className="broadcast-type-grid">
                  {formatRows.flatMap((row, rowIndex) =>
                    row.map(({ type, icon: Icon }, colIndex) => (
                      <button key={type} style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 1 }} onClick={() => chooseFormat(type)}>
                        <span className="broadcast-type-icon"><Icon size={27}/></span>
                        <strong>{type}</strong>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {previewOpen && (
            <div className="broadcast-preview-backdrop">
              <div className="broadcast-preview-sheet">
                <div className="broadcast-type-sheet-head">
                  <strong>預覽</strong>
                  <button onClick={() => setPreviewOpen(false)}><X size={27}/></button>
                </div>
                <div className="broadcast-preview-body">
                  {slots.every(slot => !slot)
                    ? <span>尚未新增訊息</span>
                    : slots.map((slot, index) => slot ? (
                      <div className="broadcast-preview-chip" key={index}>
                        {slot === '文字' ? (textValues[index] || '輸入文字') : slot}
                      </div>
                    ) : null)}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="broadcast-latest-header">
            <button onClick={() => setPage('create')}><ChevronLeft size={31}/></button>
            <strong>群發訊息設定</strong>
            <span/>
          </div>

          <div className="broadcast-settings-latest">
            <section>
              <h3>傳送時間</h3>
              <label className="broadcast-radio-latest">
                <input type="radio" checked={!scheduled} onChange={() => setScheduled(false)}/>
                <span>立即傳送</span>
              </label>
              <label className="broadcast-radio-latest">
                <input type="radio" checked={scheduled} onChange={() => setScheduled(true)}/>
                <span>預約傳送</span>
              </label>
              {scheduled && <input className="broadcast-datetime-latest" type="datetime-local"/>}
            </section>

            <section>
              <h3>群發訊息設定</h3>
              <label className="broadcast-switch-latest">
                <span>同步張貼至貼文串</span>
                <input type="checkbox" checked={postToFeed} onChange={e => setPostToFeed(e.target.checked)}/>
              </label>
              <label className="broadcast-switch-latest">
                <span>指定群發訊息則數</span>
                <input type="checkbox" checked={limitEnabled} onChange={e => setLimitEnabled(e.target.checked)}/>
              </label>
              {limitEnabled && <input className="broadcast-count-latest" type="number" min="1" value={limitCount} onChange={e => setLimitCount(e.target.value)}/>}
            </section>

            <section>
              <h3>傳送對象</h3>
              <label className="broadcast-radio-latest">
                <input type="radio" checked={audience === '所有好友'} onChange={() => setAudience('所有好友')}/>
                <span>所有好友</span>
              </label>
              <label className="broadcast-radio-latest">
                <input type="radio" checked={audience === '依屬性篩選'} onChange={() => setAudience('依屬性篩選')}/>
                <span>依屬性篩選</span>
              </label>
              {audience === '依屬性篩選' && <div className="broadcast-official-filter-help">依屬性篩選需符合 LINE 官方目標好友數條件。</div>}
            </section>
          </div>

          <div className="broadcast-settings-latest-bottom">
            <button onClick={() => flash('已儲存草稿（教學模擬）')}>儲存草稿</button>
            <button onClick={() => flash('傳送測試訊息（教學模擬）')}>傳送測試訊息</button>
            <button className="send" onClick={() => { flash('群發訊息已傳送（教學模擬）'); window.setTimeout(() => setPage('list'), 800); }}>傳送</button>
          </div>
        </>
      )}

      {toast && <div className="feature-toast">{toast}</div>}
    </div>
  );
}

function FormatIcon({ type }: { type: FormatType }) {
  if (type === '照片' || type === '多頁訊息') return <ImageIcon size={22}/>;
  if (type === '優惠券') return <Ticket size={22}/>;
  if (type === '影片' || type === '進階影片訊息') return <PlaySquare size={22}/>;
  if (type === '語音訊息') return <Mic size={22}/>;
  if (type === '貼圖') return <Smile size={22}/>;
  return <MessageCircle size={22}/>;
}
