import { useEffect, useState } from 'react';
import axios from 'axios';

export const useRemoteData = (url, expectArray = false) => {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const key = `${url}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    axios.get(url, { signal: controller.signal, timeout: 15000 })
      .then(({ data }) => {
        if (expectArray ? !Array.isArray(data) : !data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Unexpected API response');
        }
        if (!controller.signal.aborted) setResult({ key, data, error: null });
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          setResult({ key, data: null, error: error.response?.status === 404 ? 'not-found' : 'unavailable' });
        }
      });
    return () => controller.abort();
  }, [url, key, expectArray]);

  const current = result?.key === key;
  return {
    data: current ? result.data : null,
    loading: !current,
    error: current ? result.error : null,
    retry: () => setAttempt(value => value + 1),
  };
};
