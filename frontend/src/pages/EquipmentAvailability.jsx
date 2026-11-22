import React, { useState } from 'react';
import './rental.css';

export default function EquipmentAvailability() {
  const [feedback, setFeedback] = useState(null);

  function confirmPeriod(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const start = fields.get('start_at');
    const end = fields.get('end_at');

    if (new Date(end) <= new Date(start)) {
      setFeedback({ error: true });
      return;
    }

    setFeedback({ start: start.replace('T', ' '), end: end.replace('T', ' ') });
  }

  return (
    <section className="rental-panel equipment-availability" aria-labelledby="equipment-availability-heading">
      <h2 id="equipment-availability-heading">庫存與可租時段</h2>
      <dl className="rental-stock">
        <div><dt>庫存件數</dt><dd>待串接</dd></div>
        <div><dt>時段可租狀態</dt><dd>待串接</dd></div>
      </dl>

      <form className="rental-period-form" onSubmit={confirmPeriod} onChange={() => setFeedback(null)}>
        <div className="rental-period-fields">
          <label>
            <span>租借開始時間</span>
            <input type="datetime-local" name="start_at" required />
          </label>
          <label>
            <span>租借結束時間</span>
            <input type="datetime-local" name="end_at" required
              aria-invalid={feedback?.error || undefined}
              aria-describedby={feedback?.error ? 'rental-period-error' : undefined} />
          </label>
        </div>
        <button className="primary" type="submit">確認時段</button>
        {feedback?.error && (
          <p id="rental-period-error" className="rental-period-error" role="alert">
            租借結束時間必須晚於開始時間。
          </p>
        )}
        {feedback && !feedback.error && (
          <p className="rental-period-confirmation" role="status">
            已選時段：{feedback.start} 至 {feedback.end}。可租結果待庫存查詢接上後顯示。
          </p>
        )}
      </form>
    </section>
  );
}
