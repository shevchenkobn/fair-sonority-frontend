import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { setTitle } from '../features/title/titlesSlice';
import { store } from '../store';

export function NotFound() {
  const location = useLocation();

  useEffect(() => {
    store.dispatch(setTitle('Not Found'));
  }, []);

  return (
    <>
      <h1>Not Found</h1>
      <h3>
        Path: <em>{location.pathname}</em>
      </h3>
    </>
  );
}
