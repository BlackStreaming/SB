import { useState, useEffect } from 'react';

const useApi = (fn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const result = await fn();
        if (mounted) setData(result);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error };
};

export default useApi;
