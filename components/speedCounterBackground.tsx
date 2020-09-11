/**
 * 自動倒數背景
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View, Text} from 'react-native';
class SpeedCounterBackground extends React.Component {
  state = {
    initTimestamp: 0,
    nowTimestamp: 0,
    ready: false,
    starting: false,
    moving: false,
  };

  render() {
    console.log(this.props.speed.nowPosition);
    return (
      <View>
        <Text>123</Text>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  const {speed} = state;
  return {speed};
};
// const mapDispatchToProps = (dispatch) =>
//   bindActionCreators(
//     {
//       updateSpeed,
//       test2,
//     },
//     dispatch,
//   );
export default connect(
  mapStateToProps,
//   mapDispatchToProps,
)(SpeedCounterBackground);
