import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import CustomerHome from './pages/CustomerHome.jsx';
import EquipmentDetailPage from './pages/EquipmentDetailPage.jsx';
import EquipmentListPage from './pages/EquipmentListPage.jsx';
import './rental-theme.css';

function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [connection, setConnection] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState({ query: '', category: '' });
  const isEquipmentDetail = hash.startsWith('#equipment/');
  const equipmentId = isEquipmentDetail ? hash.slice('#equipment/'.length) : '';
  const view = hash === '#equipment' || isEquipmentDetail
    ? 'equipment'
    : hash === '#admin' ? 'admin' : 'customer';

  useEffect(() => {
    function updateHash() {
      setHash(window.location.hash);
      setNotice('');
    }
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    if (hash === '#services' || hash === '#rental-information') {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash]);

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
  return <>
    <header className="header">
      <a className="brand" href="#" onClick={() => setNotice('')} aria-label="序品首頁"><span className="brand-mark">序</span><span>序品 <small>CAMERA RENTALS</small></span></a>
      <nav aria-label="首頁導覽">
        <a href="#" aria-current={view === 'customer' ? 'page' : undefined}>顧客首頁</a>
        <a href="#equipment" aria-current={view === 'equipment' ? 'page' : undefined}>瀏覽器材</a>
        <a href="#admin" aria-current={view === 'admin' ? 'page' : undefined}>管理概覽<span className="preview-label">預覽</span></a>
      </nav>
      <button className="login" onClick={() => pending('登入功能')}>登入帳戶 <span aria-hidden="true">↗</span></button>
    </header>
    <main>
      <div className="topline"><span className={`connection ${connection}`} role="status"><i />{connection === 'ok' ? '系統與資料庫已連線' : connection === 'loading' ? '正在檢查連線…' : '暫時無法連線'}{connection === 'error' && <button onClick={() => setAttempt(n => n + 1)}>重試</button>}</span></div>
      {view === 'equipment' && (equipmentId
        ? <EquipmentDetailPage key={equipmentId} equipmentId={equipmentId} />
        : <EquipmentListPage filters={filters} onFiltersChange={setFilters} />)}
      {view === 'customer' && <CustomerHome onPending={pending} />}
      {view === 'admin' && <section className="dashboard"><div className="section-heading"><div><p className="eyebrow">WORKSPACE OVERVIEW</p><h1>營運概覽</h1></div><span className="draft">版面預覽</span></div><p className="admin-note">此頁是首頁版面預覽，不代表已登入或具備管理權限。統計 API 與權限驗證尚待整合，未載入任何管理資料。</p><div className="metrics">{['訂單總數', '商品品項', '庫存概況', '待處理異常'].map(label => <article key={label}><span>{label}</span><strong>—</strong><small>等待資料介面</small></article>)}</div><div className="dashboard-panels"><section className="chart-panel"><div className="section-heading"><h2>訂單趨勢</h2><span>Plotly · 規劃中</span></div><div className="chart-empty"><span aria-hidden="true">▥</span><h3>讓數據說明每一天</h3><p>接上 Python 統計 API 後，將在此呈現訂單趨勢。</p><small>目前未提供示範數字或真實統計。</small></div></section><section className="integration"><h2>模組整合進度</h2>{['登入與權限', '商品與庫存', '訂單管理', '異常檢核'].map(name => <div key={name}><span>{name}</span><span className="tag">待整合</span></div>)}<p>首頁介面已建立，將隨各模組完成逐步串接。</p></section></div></section>}
      {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="關閉提示">×</button></div>}
    </main>
    <footer><a className="footer-brand" href="#" onClick={() => setNotice('')}>序品 <span>攝影器材租借</span></a><span>專題開發預覽</span></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
