import React from 'react';
import H2 from './h2';

const AddressDisplay = ({ address, unparsedAddress }) => {
  const displayAddress = address || unparsedAddress;
  
  return (
    <H2 text={displayAddress} variant='secondary' />
  );
};

export default AddressDisplay;