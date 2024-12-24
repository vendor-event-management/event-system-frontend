import React from 'react';
import { Navigate } from 'react-router-dom';

import { verify } from './utils';
import { ProtectedRouteTypes } from './utils/enums';

export const ProtectedRoute = ({
  mainComponent: MainComponent,
  fallbackComponent: FallbackComponent,
  ...props
}) => {
  if (props.type === ProtectedRouteTypes.TRIPLE) {
    if (!verify()) {
      return <Navigate to={props.redirectTo} />;
    }

    const userRole = verify()?.role;

    if (userRole) {
      return <MainComponent {...props} />;
    } else {
      return <FallbackComponent {...props} />;
    }
  } else if (props.type === ProtectedRouteTypes.AUTH) {
    if (verify()) {
      return <Navigate to={props.redirectTo} />;
    }
    return <MainComponent {...props} />;
  } else {
    return verify() ? (
      <MainComponent {...props} />
    ) : (
      <FallbackComponent {...props} />
    );
  }
};
