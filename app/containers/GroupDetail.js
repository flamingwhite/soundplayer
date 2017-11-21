import React from 'react';
import { connect } from 'react-redux';
import { visibleAudios } from '../selectors/audioSelectors';
import { activeGroupSelector } from '../selectors/groupSelector';
import Icon from '../components/MIcon';

const GroupDetail = props => {
  const { activeGroup, itemCount } = props;
  console.log(activeGroup);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: 20 }}>
      <Icon type="favorite" />
      <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridGap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gridGap: 10 }}>
          <span style={{ fontSize: 20 }}>{activeGroup.name}</span>
          <span style={{ marginRight: 35 }}>{itemCount} Items</span>
        </div>
        <button>Play All</button>
      </div>
    </div>
  );
};

export default connect(state => ({
  activeGroup: activeGroupSelector(state),
  itemCount: visibleAudios(state).length,
}))(GroupDetail);
