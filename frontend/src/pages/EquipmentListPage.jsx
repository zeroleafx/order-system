import React from 'react';
import { EquipmentPhoto } from './EquipmentPhoto.jsx';
import { formatRate, useEquipment } from './equipmentData.js';
import './equipment.css';

export default function EquipmentListPage() {
  const { result, retry } = useEquipment();

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
                <a href={`#equipment/${item.equipment_id}`} aria-labelledby={`equipment-name-${item.equipment_id}`}>
                  <EquipmentPhoto name={item.name} />
                  <div className="equipment-card-content">
                    <p className="equipment-category">{item.category}</p>
                    <h2 id={`equipment-name-${item.equipment_id}`}>{item.name}</h2>
                    <p className="equipment-rate">
                      <strong>NT${formatRate.format(item.daily_rate)}</strong>
                      <span>／日</span>
                    </p>
                    <span className="equipment-card-action">查看詳情 <span aria-hidden="true">↗</span></span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
      )}
    </section>
  );
}
