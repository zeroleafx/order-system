import React from 'react';
import { EquipmentPhoto } from './EquipmentPhoto.jsx';
import { formatRate, useEquipment } from './equipmentData.js';
import './equipment.css';

function searchText(value) {
  return value.normalize('NFKC').toLowerCase().replace(/[–—]/g, '-');
}

export default function EquipmentListPage({ filters, onFiltersChange }) {
  const { result, retry } = useEquipment();
  const items = result.items ?? [];
  const categories = [...new Set(items.map(item => item.category))]
    .sort((left, right) => left.localeCompare(right, 'zh-TW'));
  const terms = searchText(filters.query).trim().split(/\s+/).filter(Boolean);
  const filteredItems = items.filter(item => {
    const name = searchText(item.name);
    return (!filters.category || item.category === filters.category) &&
      terms.every(term => name.includes(term));
  });
  const hasFilters = Boolean(filters.category || terms.length);

  return (
    <section className="equipment-directory" aria-labelledby="equipment-heading">
      <div className="equipment-directory-heading">
        <h1 id="equipment-heading">攝影器材</h1>
        {result.status === 'ready' && <p role="status">共 {result.items.length} 件上架器材</p>}
      </div>

      {items.length > 0 && (
        <div className="catalog-filters" role="search" aria-label="器材篩選">
          <label>
            <span>搜尋器材</span>
            <input type="search" value={filters.query} placeholder="例如 Sony、R7、50mm"
              onChange={event => onFiltersChange({ ...filters, query: event.target.value })} />
          </label>
          <label>
            <span>器材分類</span>
            <select value={filters.category}
              onChange={event => onFiltersChange({ ...filters, category: event.target.value })}>
              <option value="">全部分類</option>
              {categories.map(category => <option key={category}>{category}</option>)}
            </select>
          </label>
          {hasFilters && (
            <button type="button" className="catalog-reset"
              onClick={() => onFiltersChange({ query: '', category: '' })}>清除篩選</button>
          )}
        </div>
      )}
      {items.length > 0 && hasFilters && (
        <p className="catalog-result-count" role="status">找到 {filteredItems.length} 件器材</p>
      )}

      {result.status === 'loading' && (
        <p className="equipment-directory-message" role="status">正在載入器材…</p>
      )}
      {result.status === 'error' && (
        <div className="equipment-directory-message">
          <p role="alert">目前無法載入器材，請稍後重試。</p>
          <button type="button" className="primary" onClick={retry}>重試</button>
        </div>
      )}
      {result.status === 'ready' && items.length === 0 && (
        <p className="equipment-directory-message">目前沒有上架的器材。</p>
      )}
      {items.length > 0 && filteredItems.length === 0 && (
        <p className="equipment-directory-message">找不到符合條件的器材。</p>
      )}
      {filteredItems.length > 0 && (
        <ul className="equipment-grid" role="list">
          {filteredItems.map(item => (
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
