import React from 'react';
import { Icon, Progress, Col, Row, Tooltip } from 'antd';
import styles from './Main.css';

const getRemaining = (duration, position) => {
  const remain = Math.floor((duration - position) / 1000);
  const minutes = Math.floor(remain / 60);
  const seconds = remain % 60;
  return { minutes, seconds };
};

class Player extends React.Component {
  render() {
    const {
      playing,
      position,
      pauseClick,
      playClick,
      duration,
      liked = true,
      likeClick,
      unlikeClick,
    } = this.props;

    const { minutes, seconds } = getRemaining(duration, position);
    const percent = Math.ceil(position * 100 / duration);

    return (
      <div className={styles.mainPlayer}>
        <Row>
          <Col span={8}>
            <img
              className={styles.avatar}
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          </Col>
          <Col span={16}>
            <div className={styles.topInfo}>
              <div className={styles.singer}>Katy Perry</div>
              {playing && <Icon onClick={pauseClick} type="pause" />}
              {!playing && <Icon onClick={playClick} type="caret-right" />}
            </div>
            <div className={styles.songTitleDiv}>
              <div className={styles.songTitle}>The one that got away</div>
              <div className={styles.leftTime}>
                -{minutes}:{seconds}
              </div>
            </div>

            <Progress strokeWidth={2} percent={percent} showInfo={false} />
            <div className={styles.footer}>
              {liked && (
                <Tooltip title="Remove from Favorite">
                  <Icon
                    onClick={unlikeClick}
                    type="heart"
                    style={{ color: 'red' }}
                    className={styles.icon}
                  />
                </Tooltip>
              )}
              {!liked && (
                <Tooltip title="Add to Favorite">
                  <Icon onClick={likeClick} type="heart-o" className={styles.icon} />
                </Tooltip>
              )}
              <Icon type="delete" className={styles.icon} />
              <Icon type="fast-forward" className={styles.icon} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Player;
