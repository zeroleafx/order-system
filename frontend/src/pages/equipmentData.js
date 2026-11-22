import { useEffect, useState } from 'react';

export const formatRate = new Intl.NumberFormat('zh-TW');

export function useEquipment(equipmentId) {
  const [result, setResult] = useState({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setResult({ status: 'error' });
    }, 8000);
    const path = equipmentId ? `/${encodeURIComponent(equipmentId)}` : '';

    async function loadEquipment() {
      try {
        const response = await fetch(`/api/v1/equipment${path}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (equipmentId && [404, 422].includes(response.status)) {
          setResult({ status: 'missing' });
          return;
        }
        if (!response.ok) throw new Error('Equipment request failed');

        const data = await response.json();
        if (controller.signal.aborted) return;
        if (equipmentId && data?.equipment_id != null) {
          setResult({ status: 'ready', item: data });
        } else if (!equipmentId && Array.isArray(data)) {
          setResult({ status: 'ready', items: data });
        } else {
          setResult({ status: 'error' });
        }
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
  }, [attempt, equipmentId]);

  function retry() {
    setResult({ status: 'loading' });
    setAttempt(previous => previous + 1);
  }

  return { result, retry };
}
