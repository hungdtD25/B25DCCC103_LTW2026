import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState('');

  const showNotice = useCallback((text) => {
    setNotice(text);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = setTimeout(() => {
      setNotice('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}

      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);

  if (!context) {
    throw new Error(
      'useNotice phải được sử dụng bên trong NoticeProvider'
    );
  }

  return context;
};