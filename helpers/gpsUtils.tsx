import Geolocation from '@react-native-community/geolocation';
//https://github.com/react-native-community/react-native-geolocation
const GPSLocationNow = () => {
  try {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  } catch (err) {
    console.warn(err);
  }
};

export default GPSLocationNow;
