import React from 'react';
import { Switch, Route } from 'react-router';
import { Layout } from 'antd';
import NavContainer from '../containers/NavContainer';
import YoutubeContainer from '../containers/YoutubeContainer';
import PlayerController from '../containers/PlayerController';
import AudioListContainer from '../containers/AudioListContainer';
import GroupDetailContainer from '../containers/GroupDetail';

const { Header, Sider, Content } = Layout;
export default () => (
  <div>
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Header style={{ height: 40, background: 'white' }} />
      <Layout style={{ flex: 1 }}>
        <Sider style={{ background: 'white', display: 'flex' }}>
          <NavContainer />
        </Sider>
        <Content
          style={{ background: 'white', display: 'grid', gridTemplateRows: 'auto 1fr' }}
          className="box"
        >
          <GroupDetailContainer />
          <Switch>
            <Route exact path="/youtube" component={YoutubeContainer} />
            <Route component={AudioListContainer} />
          </Switch>
        </Content>
      </Layout>
      <div
        style={{
          height: 80,
          background: 'white',
          borderTop: '1px solid lightgray',
          alignItems: 'center',
        }}
      >
        <PlayerController />
      </div>
    </Layout>
  </div>
);
