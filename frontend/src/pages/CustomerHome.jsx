import React from 'react';
import { EquipmentPhoto } from './EquipmentPhoto.jsx';
import StoreInformation from './StoreInformation.jsx';

export default function CustomerHome({ onPending }) {
  return <>
    <section className="camera-hero" aria-labelledby="camera-hero-heading">
      <div className="camera-hero-copy">
        <p className="camera-hero-types">相機・鏡頭・拍攝配件</p>
        <h1 id="camera-hero-heading">攝影器材租借</h1>
        <p>依拍攝需求挑選器材，查看每日租金、器材介紹與租借須知。</p>
        <div className="camera-hero-actions">
          <a className="primary" href="#equipment">瀏覽器材 <span aria-hidden="true">↗</span></a>
          <a className="camera-hero-notes" href="#rental-information">查看門市資訊與租借須知</a>
        </div>
      </div>
      <EquipmentPhoto name="Canon EOS R6" showCredit />
    </section>

    <section id="services" className="services rental-services" aria-labelledby="rental-services-heading">
      <h2 id="rental-services-heading">租借服務</h2>
      <div className="cards">
        <article className="service-card">
          <h3>器材目錄</h3>
          <p>可依名稱搜尋或依分類篩選，點開器材查看照片與租金。</p>
          <a className="service-link" href="#equipment">前往器材列表 <span aria-hidden="true">↗</span></a>
        </article>
        <article className="service-card">
          <h3>租借紀錄</h3>
          <p>查看預約進度和歸還紀錄。</p>
          <button type="button" onClick={() => onPending('租借紀錄')}>功能準備中</button>
        </article>
        <article className="service-card">
          <h3>個人帳戶</h3>
          <p>登入後管理個人資料與預約。</p>
          <button type="button" onClick={() => onPending('帳號模組')}>功能準備中</button>
        </article>
      </div>
    </section>

    <StoreInformation />
    <section className="journey rental-journey" aria-labelledby="rental-journey-heading">
      <h2 id="rental-journey-heading">租借流程</h2>
      <ol>
        <li><span>瀏覽器材<small>查看照片、租金和介紹</small></span></li>
        <li><span>選擇時段<small>填寫預計取件和歸還時間</small></span></li>
        <li><span>確認預約<small>預約功能準備中</small></span></li>
      </ol>
    </section>
  </>;
}
