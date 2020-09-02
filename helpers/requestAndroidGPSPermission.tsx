import {PermissionsAndroid} from 'react-native';

const RequestAndroidGPSPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'GPS Permission',
        message: 'Jump Start needs access to your GPS ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the GPS');
    } else {
      console.log('GPS permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default RequestAndroidGPSPermission;
