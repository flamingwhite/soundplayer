import React from 'react';
import { Switch, Route } from 'react-router';
import { Button, Layout, Spin } from 'antd';
import NavContainer from '../containers/NavContainer';
import HomePage from '../routes/Home';
import YoutubeContainer from '../containers/YoutubeContainer';
import FavoriteAudiosContainer from '../containers/FavoriteAudiosContainer';
import PlayerController from '../containers/PlayerController';

const { Header, Sider, Content } = Layout;
export default () => (
  <div>
    <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header style={{ height: 40, background: 'white' }}>
        <h5>SilverX</h5>
      </Header>
      <Layout>
        <Sider>
          <NavContainer />
        </Sider>
        <Content style={{ background: 'white' }}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/favorite" component={FavoriteAudiosContainer} />
            <Route exact path="/youtube" component={YoutubeContainer} />
          </Switch>
        </Content>
      </Layout>
      <Content style={{ height: 100 }}>
        <PlayerController />
      </Content>
    </Layout>
  </div>
);
