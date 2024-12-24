import React from 'react';
import { Navigate } from 'react-router-dom';

import { verify as user } from './utils';
import { ProtectedRouteTypes } from './utils/enums';

export const ProtectedRoute = ({
  mainComponent: MainComponent,
  fallbackComponent: FallbackComponent,
  ...props
}) => {
  if (props.type === ProtectedRouteTypes.TRIPLE) {
    if (!user()) {
      return <Navigate to={props.redirectTo} />;
    }

    const userRole = user()?.role;

    if (userRole) {
      return <MainComponent {...props} />;
    } else {
      return <FallbackComponent {...props} />;
    }
  } else if (props.type === ProtectedRouteTypes.AUTH) {
    if (user()) {
      return <Navigate to={props.redirectTo} />;
    }
    return <MainComponent {...props} />;
  } else {
    return user() ? (
      <MainComponent {...props} />
    ) : (
      <FallbackComponent {...props} />
    );
  }
};
