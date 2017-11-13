import React from 'react';

const SearchHighlight = props => {
  const { search, value = '', bg = '#ff9632', ...rest } = props;

  if (!search) {
    return <span>{value}</span>;
  }

  const buildStr = (searchStr, valueStr, result = []) => {
    if (!searchStr || !valueStr.toLowerCase().includes(searchStr.toLowerCase())) {
      return result.concat(valueStr);
    }
    const index = valueStr.toLowerCase().indexOf(searchStr.toLowerCase());
    return buildStr(
      searchStr,
      valueStr.slice(index + searchStr.length),
      result.concat([
        valueStr.slice(0, index),
        <span style={{ backgroundColor: bg }}>
          {valueStr.slice(index, index + searchStr.length)}
        </span>,
      ]),
    );
  };

  return <span {...rest}>{buildStr(search, value)}</span>;
};

export default SearchHighlight;
