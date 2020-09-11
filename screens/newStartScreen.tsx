import React from 'react';
import {
  Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import haversine from 'haversine';
import Geolocation from 'react-native-geolocation-service';
import {updateSpeed, test2} from '../reducers/speedAction';
import BackgroundTimer from 'react-native-background-timer';

const SETTING_DISTANCE = 100; //meter

class NewStartScreen extends React.Component {
  watchId: number | null = null;
  state = {
    forceLocation: true,
    highAccuracy: true,
    loading: false,
    showLocationDialog: true,
    significantChanges: false,
    updatesEnabled: false,
    foregroundService: false,
    location: {},
    previousLocation: {},
    coordinate: {},
    previousCoordinate: {},
    timestamp: 0,
    previousTimestamp: 0,
    gpsSpeed: 0,
    distance: 0,
    records: [],
    // timestamp: 0,
    // previousTimestamp: 0,
  };
  recordId: number = 0;
  record = {
    id: 0,
    startCoordinate: {},
    nowCoordinate: {},
    distance: 0,
    logs: [],
    startTimestamp: 0,
    finishTimestamp: 0,
    status: 0, //0 waiting stop, 1 readyToStart, 2 start, 3 finish
    nowSpeed: 0,
  };
  showStatusText = '';

  componentDidMount() {
    this.getLocation();
    this.getLocationUpdates();
    this.initRecord();
    BackgroundTimer.runBackgroundTimer(() => {
      this.checkRecord();
    }, 100);
  }

  componentWillUnmount() {
    this.removeLocationUpdates();
    BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
  }

  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow app to determine your location.',
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            location: position,
            loading: false,
            coordinate: position.coords,
            timestamp: position.timestamp,
          });
          console.log(position);
          this.initRecord();
        },
        (error) => {
          this.setState({location: error, loading: false});
          console.log(error);
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    if (Platform.OS === 'android' && this.state.foregroundService) {
      //await this.startForegroundService();
    }

    this.setState({updatesEnabled: true}, () => {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          this.setState({
            previousLocation: this.state.location,
            previousCoordinate: this.state.coordinate,
            previousTimestamp: this.state.timestamp,
          });
          this.setState({
            location: position,
            coordinate: position.coords,
            timestamp: position.timestamp,
          });

          console.log(position);
          //console.log(position.coords.speed);
          //   var speedObject = {
          //     speed: position.coords.speed,
          //     latitude: position.coords.latitude,
          //     position: position,
          //   };

          //this.props.updateSpeed(speedObject);
          //this.props.test2(speedObject);
          //this.props.test2(speedObject);
          let distance = 0;
          if (this.state.previousLocation && this.state.location) {
            distance =
              this.state.distance +
              haversine(this.state.previousCoordinate, this.state.coordinate, {
                unit: 'meter',
              });
            this.state.distance = distance;

            this.record.distance = haversine(this.record.startCoordinate, this.state.coordinate, {
                unit: 'meter',
              });
          }
          //console.log(distance);
        },
        (error) => {
          this.setState({location: error});
          console.log(error);
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          distanceFilter: 0,
          interval: 100,
          fastestInterval: 100,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
          useSignificantChanges: this.state.significantChanges,
        },
      );
    });
  };

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
      //this.stopForegroundService();
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.setState({updatesEnabled: false});
    }
  };

  initRecord = async () => {
    //await this.getLocation();
    console.log(this.state);
    this.recordId++;
    this.record.id = this.recordId;
    this.record.startCoordinate = this.state.coordinate;
    this.record.startTimestamp = this.state.timestamp;
    this.record.status = 0;
  };

  //   record = {
  //     id: 0,
  //     startCoordinate: {},
  //     nowCoordinate: {},
  //     distance: 0,
  //     logs: [],
  //     startTimestamp: 0,
  //     finishTimestamp: 0,
  //     status: 0, //0 waiting stop, 1 readyToStart, 2 start, 3 finish
  //     nowSpeed: 0,
  //   };

  checkRecord = () => {
    switch (this.record.status) {
      case 0:
        this.showStatusText = 'STOP AND WAIT!';

        if (this.state.gpsSpeed <= 0.005) {
          this.record.status = 1; //ready to start and set start time
          this.record.startTimestamp =
            new Date().getTime() + Math.random() * (8000 - 5000 + 1);
          this.record.startCoordinate = this.state.coordinate;
          //this.initRecord();
        }

        break;
      case 1:
        this.showStatusText = 'READY!';

        if (this.state.gpsSpeed > 0.005) {
          // 偷起跑
          this.record.status = 3; //finish
          break;
        }

        if (new Date().getTime() >= this.record.startTimestamp) {
          this.record.status = 2;
        }

        break;
      case 2:
        this.showStatusText = 'GO!';

        if (this.record.distance >= SETTING_DISTANCE) {
          this.record.status = 3;
        }

        break;
      case 3:
        this.showStatusText = 'THIS RECORD FINISHED!';

        //save record then init new record;
        this.initRecord();

        break;
      default:
        console.log('');
        break;
    }
    //console.log('record');
  };

  setAccuracy = (value: any) => this.setState({highAccuracy: value});
  setSignificantChange = (value: any) =>
    this.setState({significantChanges: value});
  setLocationDialog = (value: any) =>
    this.setState({showLocationDialog: value});
  setForceLocation = (value: any) => this.setState({forceLocation: value});
  setForegroundService = (value: any) =>
    this.setState({foregroundService: value});

  render() {
    return (
      <View>
        <Text>Record:{this.record.id}</Text>
        <Text>{this.showStatusText}</Text>
        <Text>{this.record.nowSpeed} KM/h</Text>
        <Text>{this.record.distance} Meter</Text>
        <Text>
          {(new Date().getTime() - this.record.startTimestamp) / 1000} Sec
        </Text>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  const {speed} = state;
  return {speed};
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSpeed,
      test2,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(NewStartScreen);
