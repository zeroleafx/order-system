import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
function App() {
  const [status, setStatus] = useState('Checking connection…');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/health', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('API unavailable'); return response.json(); })
      .then(data => setStatus(`API: ${data.status} · Database: ${data.database}`))
      .catch(error => { if (error.name !== 'AbortError') setStatus('Cannot reach API. Check the backend container and refresh.'); });
    return () => controller.abort();
  }, []);
  return <main><p className="eyebrow">SPRINT 1 · FOUNDATION</p><h1>Order & Inventory</h1><p>A shared starting point for order tracking, stock management, and anomaly detection.</p><section><h2>System connection</h2><p role="status">{status}</p><a href="http://localhost:8000/docs">Explore API documentation →</a></section><p>Order, inventory, and anomaly features will be added in later sprints.</p></main>;
}
createRoot(document.getElementById('root')).render(<App />);
