import React from 'react';
import { Spin } from 'antd';

export default (isLoadingByProps, text = 'loading') => InnerCmp => props =>
  isLoadingByProps(props) ? (
    <Spin tip={text}>
      <InnerCmp {...props} />
    </Spin>
  ) : (
    <InnerCmp {...props} />
  );
