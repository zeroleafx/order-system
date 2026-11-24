import React from 'react';
import EquipmentAvailability from './EquipmentAvailability.jsx';
import { EquipmentPhoto, equipmentDescription } from './EquipmentPhoto.jsx';
import { formatRate, useEquipment } from './equipmentData.js';
import './equipment.css';

export default function EquipmentDetailPage({ equipmentId }) {
  const { result, retry } = useEquipment(equipmentId);
  const { item } = result;

  return (
    <section className="equipment-detail" aria-labelledby="equipment-detail-heading">
      <a className="equipment-back" href="#equipment">← 返回器材列表</a>
      {item ? <>
        <div className="equipment-detail-layout">
          <EquipmentPhoto name={item.name} showCredit />
          <div className="equipment-detail-content">
            <p className="equipment-category">{item.category}</p>
            <h1 id="equipment-detail-heading">{item.name}</h1>
            <p className="equipment-rate">
              <span>每日租金</span>
              <strong>NT${formatRate.format(item.daily_rate)}</strong>
              <span>／日</span>
            </p>
            <h2>器材介紹</h2>
            <p className="equipment-description">{equipmentDescription(item) || '目前沒有器材介紹。'}</p>
          </div>
        </div>
        <EquipmentAvailability />
      </> : (
        <div className="equipment-directory-message">
          <h1 id="equipment-detail-heading">器材詳情</h1>
          {result.status === 'loading' && <p role="status">正在載入器材…</p>}
          {result.status === 'missing' && <p role="status">找不到這件上架器材。</p>}
          {result.status === 'error' && (
            <>
              <p role="alert">目前無法載入器材，請稍後重試。</p>
              <button type="button" className="primary" onClick={retry}>重試</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
