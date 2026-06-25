import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../api/taskApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    authApi
      .checkAuth()
      .then(() => {
        if (isMounted) {
          setAuthenticated(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthenticated(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (authenticated === null) {
    return <div>Checking authentication...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
