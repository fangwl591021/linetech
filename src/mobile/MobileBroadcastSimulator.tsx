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

type BroadcastPage = 'list' | 'create';
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
      ) : (
        <>
          <div className="broadcast-latest-header">
            <button onClick={() => setPage('list')}><ChevronLeft size={31}/></button>
            <strong>建立</strong>
            <button className="broadcast-latest-preview-link" onClick={() => setPreviewOpen(true)}>預覽</button>
          </div>

          <div className="broadcast-slot-area">
            {slots.map((slot, index) => {
              const enabled = index === 0 || Boolean(slots[index - 1]);
              return (
                <div className="broadcast-slot-row" key={index}>
                  <div className="broadcast-slot-avatar">K</div>
                  <button
                    className={`broadcast-slot-card ${enabled ? 'enabled' : 'disabled'} ${activeSlot === index && pickerOpen ? 'active' : ''}`}
                    disabled={!enabled}
                    onClick={() => openSlot(index)}
                  >
                    {slot ? (
                      <div className="broadcast-slot-selected">
                        <FormatIcon type={slot}/>
                        <strong>{slot}</strong>
                        <span>點此變更</span>
                      </div>
                    ) : (
                      <span className="broadcast-slot-add"><Plus size={22}/> 新增</span>
                    )}
                  </button>
                </div>
              );
            })}
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
                    : slots.filter(Boolean).map((slot, index) => <div className="broadcast-preview-chip" key={index}>{slot}</div>)}
                </div>
              </div>
            </div>
          )}
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
