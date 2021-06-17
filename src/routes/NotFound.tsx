import { useLocation } from 'react-router';

export function NotFound() {
  const location = useLocation();

  return (
    <>
      <h1>Not Found</h1>
      <h3>
        Path: <em>{location.pathname}</em>
      </h3>
    </>
  );
}
