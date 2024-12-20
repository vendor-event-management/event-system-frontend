import React, { Fragment } from 'react';
import { verify } from '../utils';

function Header() {
  return <Fragment>{verify() && <h1>Header</h1>}</Fragment>;
}

export default Header;
