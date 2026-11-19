import { useEffect, useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);

      return saved !== null
        ? JSON.parse(saved)
        : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      // Bỏ qua lỗi localStorage
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;