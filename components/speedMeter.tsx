import React from 'react';
import {
  Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

//import Geolocation from 'react-native-geolocation-service';
//https://github.com/Agontuk/react-native-geolocation-service

export default class SpeedMeter extends React.Component {
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
  };

  componentDidMount() {
    this.getLocationUpdates();
  }

  componentWillUnmount() {
    this.removeLocationUpdates();
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
          this.setState({location: position, loading: false});
          console.log(position);
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
          this.setState({location: position});
          console.log(position);
        },
        (error) => {
          this.setState({location: error});
          console.log(error);
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
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

  setAccuracy = (value: any) => this.setState({highAccuracy: value});
  setSignificantChange = (value: any) =>
    this.setState({significantChanges: value});
  setLocationDialog = (value: any) =>
    this.setState({showLocationDialog: value});
  setForceLocation = (value: any) => this.setState({forceLocation: value});
  setForegroundService = (value: any) =>
    this.setState({foregroundService: value});

  render() {
    const {
      forceLocation,
      highAccuracy,
      loading,
      location,
      showLocationDialog,
      significantChanges,
      updatesEnabled,
      foregroundService,
    } = this.state;

    return (
      // <View style={styles.container}>
      //   <View style={styles.result}>
      <View>
        <View>
          <Text>{JSON.stringify(location, null, 4)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 12,
  },
  optionContainer: {
    paddingBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
});
