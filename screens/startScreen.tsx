import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
//https://github.com/ocetnik/react-native-background-timer
import SpeedMeter from '../components/speedMeter';
import SpeedCounterBackground from '../components/speedCounterBackground';

//import TestMeter from '../components/test';

// const CenterSpeedMeter = [
//   {
//     id: 'getCurrentPosition',
//     title: 'Geolocation.getCurrentPosition',
//     description: 'Asynchronously load and observe location',
//     render() {
//       return <SpeedMeter />;
//     },
//   },
// ];

const LONGEST_WAIT_TIME = 10000;

var startObject = {
  ready: false, //ready to start
  start: false, //recording
  startTimestamp: 0, //start recording time
  first: true, //not moving yet
  firstTimestamp: 0,
  recordNumber: 0,
  lastCheckTimestamp: 0,
  lastCheckLatitude: 0,
  lastCheckLongitude: 0,
};

class StartScreen extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     nowSpeed: 0,
  //   };
  // }

  componentDidMount() {

    startObject.recordNumber = 0;

    BackgroundTimer.runBackgroundTimer(() => {
      checkShouldRestart(this.props.speed);
    }, 100);
  }
  // static getDerivedStateFromProps(props, state) {
  //   console.log('kk');
  //   return null;
  // }

  componentWillUnmount() {
    console.log('88');
    BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
  }

  render() {
    checkShouldRestart(this.props.speed);
    //const {nowSpeed} = this.state;
    return (
      <View>
        <Text>Start Screen test</Text>
        <SpeedMeter />

        <Text>{this.props.speed.nowSpeed} KM/h</Text>
        {/* <SpeedCounterBackground /> */}
        {/* <Text>{this.props.start.nowSpeed} KM/h</Text> */}
      </View>
    );
  }
  _renderExample = (example: any) => {
    return (
      <View
        testID={`example-${example.id}`}
        key={example.title}
        style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>{example.title}</Text>
        <Text style={styles.exampleDescription}>{example.description}</Text>
        <View style={styles.exampleInnerContainer}>{example.render()}</View>
      </View>
    );
  };
}
const mapStateToProps = (state) => {
  const {speed} = state;
  //checkShouldRestart(speed);
  return {speed};
};



const checkShouldRestart = (speed) => {
  //if ()startObject.startTimestamp
  if (speed == null || speed.nowPosition == null) {
    return;
  }
  if (startObject.ready) {
    return;
  }

  if (speed.nowPosition.nowSpeed === 0) {
    console.log('speed0');
    startObject.ready = true;
    startObject.start = false;
  }

  var needStartCheck = false;
  var needLatCheck = false;
  var needLngCheck = false;
  if (startObject.lastCheckLatitude !== speed.nowPosition.coords.latitude) {
    startObject.lastCheckLatitude = speed.nowPosition.coords.latitude;
  } else {
    needLatCheck = true;
  }
  
  if (startObject.lastCheckLongitude !== speed.nowPosition.coords.longitude) {
    startObject.lastCheckLongitude = speed.nowPosition.coords.longitude;
  } else {
    needLngCheck = true;
  }
  // console.log('needLatCheck:' + needLatCheck);
  // console.log('needLngCheck:' + needLngCheck);

  if (needLatCheck && needLngCheck) {
    if (startObject.lastCheckTimestamp === 0) {
      startObject.lastCheckTimestamp = speed.nowPosition.timestamp;
      startObject.firstTimestamp = speed.nowPosition.timestamp;
      console.log('???');
    } else if (
      speed.nowPosition.timestamp - startObject.lastCheckTimestamp >
      LONGEST_WAIT_TIME
    ) {
      console.log('speed0');
      //console.log(startObject);
      if (startObject.start) {
        //TODO 寫入record
        console.log('TODO 寫入record1:' + startObject.recordNumber);
        console.log(startObject);
        startObject.start = false;
      }
      startObject.ready = true;
    }
  } else {
    console.log('moving');
    if (startObject.start) {
      if (
        speed.nowPosition.timestamp - startObject.startTimestamp >
        LONGEST_WAIT_TIME
      ) {
        //TODO 寫入record
        console.log('TODO 寫入record2:' + startObject.recordNumber);
        console.log(startObject);
        startObject.start = false;
      }
    }

  }

  if (startObject.ready && !startObject.start) {
    setTimeout(() => {
      startObject.ready = false;
      startObject.start = true;
      startObject.startTimestamp = speed.nowPosition.timestamp;
      startObject.recordNumber++;
      console.log('recording:' + startObject.recordNumber);
    }, 3000); //TODO 開始秒數random
  }

  // if (startObject.startTimestamp === 0) {
  //   startObject.startTimestamp = speed.nowPosition.coords.timestamp;
  //   console.log(startObject.startTimestamp);
  // }

  //console.log(speed);
};

export default connect(mapStateToProps)(StartScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  sectionTitle: {
    fontSize: 24,
    marginHorizontal: 8,
    marginTop: 24,
  },
  exampleContainer: {
    padding: 16,
    marginVertical: 4,
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  exampleTitle: {
    fontSize: 18,
  },
  exampleDescription: {
    color: '#333333',
    marginBottom: 16,
  },
  exampleInnerContainer: {
    borderColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 16,
  },
});
