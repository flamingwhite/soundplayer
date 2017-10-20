// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import styles from './Home.css';
import PlayerController from '../playerComponents/PlayerController';
import PlayListContainer from '../playerComponents/PlayListContainer';
import AudioListContainer from '../playerComponents/AudioListContainer';
import PlayModeContainer from '../playerComponents/PlayModeContainer';

const { Header, Sider, Footer, Content } = Layout;

export default class Home extends Component {
  render() {
    return (
      <div>
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Header style={{ height: 60 }}>
            <PlayerController />
          </Header>
          <Layout>
            <Sider>
              <PlayListContainer />
            </Sider>
            <Content style={{ background: 'white' }}>
              <AudioListContainer />
            </Content>
          </Layout>
          <Footer style={{ height: 100 }}>
            <PlayModeContainer />
          </Footer>
        </Layout>
      </div>
    );
  }
}
