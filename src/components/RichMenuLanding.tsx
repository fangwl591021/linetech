export function RichMenuLanding({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="workspace-content landing">
      <div className="page-title"><h1>圖文選單</h1></div>
      <div className="landing-body">
        <div className="landing-illustration">
          <div className="mini-phone">
            <div className="mini-head">● Brown Coffee</div>
            <div className="mini-chat">您好，這裡是 Brown Coffee。</div>
            <div className="mini-menu"><div>優惠券發放中</div><div>預約座位</div><div>店家資訊</div><div>本月菜單</div><div>交通方式</div></div>
          </div>
          <div className="person-placeholder">👩🏻‍💼<span>✓</span></div>
        </div>
        <div className="landing-copy">
          <h2>可以在聊天室顯示螢幕選單，引導用戶執行動作。</h2>
          <p>圖文選單是可以在官方帳號的聊天室中，把選單放大顯示的功能。</p>
          <p>只要指定背景照片及選擇單點擊後執行的網站網址，就能輕鬆完成設定。</p>
          <p>每當用戶打開聊天室，選單就會顯示在畫面上的顯眼位置，能更有效地引導用戶使用優惠券及預約等各式各樣的動作。</p>
          <button className="btn primary create-landing" onClick={onCreate}>建立圖文選單</button>
        </div>
      </div>
    </section>
  );
}
