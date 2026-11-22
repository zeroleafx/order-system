import React, { useEffect, useState } from 'react';
import './equipment.css';

const formatRate = new Intl.NumberFormat('zh-TW');

export default function EquipmentListPage() {
  const [result, setResult] = useState({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setResult({ status: 'error' });
    }, 8000);

    async function loadEquipment() {
      try {
        const response = await fetch('/api/v1/equipment', { signal: controller.signal });
        if (!response.ok) throw new Error('Equipment request failed');
        const items = await response.json();
        if (!Array.isArray(items)) throw new Error('Unexpected equipment response');
        if (!controller.signal.aborted) setResult({ status: 'ready', items });
      } catch {
        if (!controller.signal.aborted) setResult({ status: 'error' });
      } finally {
        clearTimeout(timeout);
      }
    }

    loadEquipment();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  function retry() {
    setResult({ status: 'loading' });
    setAttempt(previous => previous + 1);
  }

  return (
    <section className="equipment-directory" aria-labelledby="equipment-heading">
      <div className="equipment-directory-heading">
        <h1 id="equipment-heading">攝影器材</h1>
        {result.status === 'ready' && <p role="status">共 {result.items.length} 件上架器材</p>}
      </div>

      {result.status === 'loading' && (
        <p className="equipment-directory-message" role="status">正在載入器材…</p>
      )}
      {result.status === 'error' && (
        <div className="equipment-directory-message">
          <p role="alert">目前無法載入器材，請稍後重試。</p>
          <button type="button" className="primary" onClick={retry}>重試</button>
        </div>
      )}
      {result.status === 'ready' && (
        result.items.length === 0
          ? <p className="equipment-directory-message">目前沒有上架的器材。</p>
          : <ul className="equipment-grid" role="list">
            {result.items.map(item => (
              <li className="equipment-card" key={item.equipment_id}>
                <p className="equipment-category">{item.category}</p>
                <h2>{item.name}</h2>
                <p className="equipment-rate">
                  <strong>NT${formatRate.format(item.daily_rate)}</strong>
                  <span>／日</span>
                </p>
              </li>
            ))}
          </ul>
      )}
    </section>
  );
}
