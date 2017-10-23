// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Layout, Spin } from 'antd';
import styles from './Home.css';
import PlayerController from '../containers/PlayerController';
import NavContainer from '../containers/NavContainer';
import AudioListContainer from '../containers/AudioListContainer';
import PlayModeContainer from '../containers/PlayModeContainer';

const { Header, Sider, Footer, Content } = Layout;

class HomeContainer extends Component {
  render() {
    const { tip = 'Loading', globalLoading } = this.props;
    return (
      <div className="home-container">
        <Spin tip={tip} spinning={globalLoading}>
          <AudioListContainer />
        </Spin>
      </div>
    );
  }
}

export default connect(state => ({
  globalLoading: state.appStateChunk.globalLoading,
}))(HomeContainer);
