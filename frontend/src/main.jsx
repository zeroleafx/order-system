import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const modules = [
  { number: '01', title: '探索商品', text: '從商品資訊開始，找到符合需求的選擇。', tag: '商品模組', icon: '▦' },
  { number: '02', title: '追蹤訂單', text: '訂單明細與處理進度，在同一個地方查看。', tag: '訂單模組', icon: '≡' },
  { number: '03', title: '個人帳戶', text: '登入後管理個人資料，開啟專屬購物流程。', tag: '帳號模組', icon: '◉' },
];
function App() {
  const [view, setView] = useState('customer');
  const [connection, setConnection] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 8000);
    setConnection('loading');
    fetch('/api/health', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => setConnection(data.status === 'ok' && data.database === 'connected' ? 'ok' : 'error'))
      .catch(error => { if (error.name !== 'AbortError' || timedOut) setConnection('error'); })
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  const pending = name => setNotice(`${name}尚未開放，目前正在等待對應模組整合。`);
  const changeView = next => { setView(next); setNotice(''); };
  return <>
    <header className="header">
      <a className="brand" href="#" onClick={() => changeView('customer')} aria-label="序品首頁"><span className="brand-mark">序</span><span>序品 <small>ORDER & INVENTORY</small></span></a>
      <nav aria-label="首頁導覽"><button className={view === 'customer' ? 'active' : ''} onClick={() => changeView('customer')}>顧客首頁</button><button className={view === 'admin' ? 'active' : ''} onClick={() => changeView('admin')}>管理概覽<span className="preview-label">預覽</span></button></nav>
      <button className="login" onClick={() => pending('登入功能')}>登入帳戶 <span aria-hidden="true">↗</span></button>
    </header>
    <main>
      <div className="topline"><span>ORDER SYSTEM / V2</span><span className={`connection ${connection}`} role="status"><i />{connection === 'ok' ? '系統與資料庫已連線' : connection === 'loading' ? '正在檢查連線…' : '暫時無法連線'}{connection === 'error' && <button onClick={() => setAttempt(n => n + 1)}>重試</button>}</span></div>
      {view === 'customer' ? <>
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow">讓每一次選擇，都井然有序</p><h1>從選擇商品，<br />到安心收單。</h1><p className="intro">商品、訂單與進度，一站掌握。<br />簡單清楚的流程，讓每一步都有跡可循。</p><a className="primary" href="#services">探索服務 <span aria-hidden="true">↗</span></a><div className="hero-note"><span /> 顧客首頁初版 · 功能陸續整合中</div></div>
          <div className="hero-art" aria-hidden="true"><div className="art-caption">EVERYTHING, IN ORDER.<span>精簡流程・清楚掌握</span></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="parcel parcel-back"><span>ORDER / 002</span></div><div className="parcel parcel-front"><div className="tape"/><b>序品</b><span>CURATED & ORGANIZED</span><div className="barcode"/></div><div className="art-badge"><span>✓</span> 每一步，都有紀錄</div><span className="art-bottom">A BETTER WAY TO KEEP TRACK ↗</span></div>
        </section>
        <section id="services" className="services"><div className="section-heading"><div><p className="eyebrow">YOUR EVERYDAY ESSENTIALS</p><h2>你需要的，都在這裡。</h2></div><p>從瀏覽到管理，清楚找到下一步。</p></div><div className="cards">{modules.map(item => <article className="service-card" key={item.number}><div className="card-top"><span className="service-icon" aria-hidden="true">{item.icon}</span><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => pending(item.tag)}><span>功能準備中</span><span aria-hidden="true">↗</span></button></article>)}</div></section>
        <section className="journey"><div><p className="eyebrow">SIMPLE BY DESIGN</p><h2>簡單三步，開始使用。</h2></div><ol><li><b>01</b><span>瀏覽商品<small>查看品項與商品資訊</small></span></li><li><b>02</b><span>登入與下單<small>確認商品及所需數量</small></span></li><li><b>03</b><span>查看進度<small>追蹤訂單處理狀態</small></span></li></ol><p className="planned">以上為預期使用流程，尚未開放下單。</p></section>
      </> : <section className="dashboard"><div className="section-heading"><div><p className="eyebrow">WORKSPACE OVERVIEW</p><h1>營運概覽</h1></div><span className="draft">版面預覽</span></div><p className="admin-note">此頁是首頁版面預覽，不代表已登入或具備管理權限。統計 API 與權限驗證尚待整合，未載入任何管理資料。</p><div className="metrics">{['訂單總數', '商品品項', '庫存概況', '待處理異常'].map(label => <article key={label}><span>{label}</span><strong>—</strong><small>等待資料介面</small></article>)}</div><div className="dashboard-panels"><section className="chart-panel"><div className="section-heading"><h2>訂單趨勢</h2><span>Plotly · 規劃中</span></div><div className="chart-empty"><span aria-hidden="true">▥</span><h3>讓數據說明每一天</h3><p>接上 Python 統計 API 後，將在此呈現訂單趨勢。</p><small>目前未提供示範數字或真實統計。</small></div></section><section className="integration"><h2>模組整合進度</h2>{['登入與權限', '商品與庫存', '訂單管理', '異常檢核'].map(name => <div key={name}><span>{name}</span><span className="tag">待整合</span></div>)}<p>首頁介面已建立，將隨各模組完成逐步串接。</p></section></div></section>}
      {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="關閉提示">×</button></div>}
    </main>
    <footer><a className="footer-brand" href="#" onClick={() => changeView('customer')}>序品 <span>ORDER & INVENTORY</span></a><p>讓商品有序，讓流程清楚。</p><span>V2 · 開發預覽</span></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
