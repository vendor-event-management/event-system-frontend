import React from 'react';
import { Navigate } from 'react-router-dom';

import { verify } from './utils';
import { TOKEN_NAME, ProtectedRouteTypes } from './utils/enums';

export const ProtectedRoute = ({
  component: MainComponent,
  fallbackComponent: FallbackComponent,
  ...props
}) => {
  const token = JSON.parse(localStorage.getItem(TOKEN_NAME));
  console.log('props : ', props);

  if (props.type === ProtectedRouteTypes.TRIPLE) {
    if (!token) {
      return <Navigate to={props.redirectTo} />;
    }

    const userRole = verify()?.role;

    if (userRole === 'admin') {
      return <MainComponent {...props} />;
    } else {
      return <FallbackComponent {...props} />;
    }
  } else {
    return token ? (
      <MainComponent {...props} />
    ) : (
      <FallbackComponent {...props} />
    );
  }
};
