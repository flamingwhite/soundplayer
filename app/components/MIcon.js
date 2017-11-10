import React from 'react';

const MIcon = props => {
  const { type, className, ...rest } = props;
  return (
    <i className={`material-icons ${className}`} {...rest}>
      {type}
    </i>
  );
};

export default MIcon;
