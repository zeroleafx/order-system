import React from 'react';
import './rental.css';

export default function StoreInformation() {
  return (
    <section id="rental-information" className="rental-information" aria-labelledby="rental-information-heading">
      <h2 id="rental-information-heading">門市資訊與租借須知</h2>
      <div className="rental-information-grid">
        <div className="rental-panel">
          <h3>門市聯絡資訊</h3>
          <dl className="store-details">
            <dt>地址</dt>
            <dd>臺北市中正區博愛路 00 號</dd>
            <dt>電話</dt>
            <dd>02-1234-0000</dd>
            <dt>營業時間</dt>
            <dd>週二至週日 11:00–19:00，週一公休</dd>
          </dl>
        </div>
        <div className="rental-panel">
          <h3>租借須知</h3>
          <ol className="rental-notes">
            <li>取件時請攜帶身分證件，並出示預約資訊供門市核對。</li>
            <li>取件和歸還時，請與店員一起清點配件、檢查器材。</li>
            <li>如需改約或延後歸還，請事先聯絡門市確認。</li>
            <li>每筆訂單需支付五成押金，租借前押金和租金一同支付，歸還後確認器材沒問題即可退回押金。</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
