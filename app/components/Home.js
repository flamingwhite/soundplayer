// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import styles from './Home.css';
import PlayerController from '../playerComponents/PlayerController';
import PlayListContainer from '../playerComponents/PlayListContainer';
import AudioListContainer from '../playerComponents/AudioListContainer';
import PlayModeContainer from '../playerComponents/PlayModeContainer';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <PlayerController />
          <div className={styles.mainBoard}>
            <div className={styles.playListContainer}>
              <PlayListContainer />
            </div>
            <div className={styles.audioListContainer}>
              <AudioListContainer />
            </div>
          </div>
        </div>
        <PlayModeContainer />
      </div>
    );
  }
}
