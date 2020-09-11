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
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//https://react-native-community.github.io/async-storage/docs/usage

class SettingScreen extends React.Component {
  state = {
    distanceMeter: '0',
    highAccuracy: true,
  };

  constructor(props) {
    super(props);
    this.getStorage();
  }

  componentDidMount() {}

  getStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('@Settings:distanceMeter');
      console.log(value);
      if (value !== null) {
        // console.log(value);
        // this.setState({ firstPage: value });
        this.setState({distanceMeter: value});
      } else {
        this.setState({distanceMeter: '100'}); //setDefault

        await AsyncStorage.setItem(
          '@Settings:distanceMeter',
          this.state.distanceMeter,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  putStorage = async () => {
    try {
      await AsyncStorage.setItem(
        '@Settings:distanceMeter',
        this.state.distanceMeter,
      );

      //const value = await AsyncStorage.getItem('@Settings:distanceMeter');
      //console.log(value);

      console.log(this.state.distanceMeter + '|saved');
    } catch (error) {
      // Error saving data
    }
  };

  changeDistanceMeter = (event) => {
    //console.log(event.nativeEvent.text);
    //const {name, type, text} = event;
    //this.putStorage();

    let text = event.nativeEvent.text;
    console.log(text);
    let a = Number(text) || 100;
    let b = a.toString();
    this.setState({distanceMeter: b});
    this.putStorage();
  };

  render() {
    const {highAccuracy} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <View style={styles.option}>
            <Text>Finish Line Distance</Text>
            <TextInput
              style={styles.textInput}
              editable
              value={this.state.distanceMeter}
              // onChangeText={this.changeDistanceMeter}
              onChange={this.changeDistanceMeter}
              onBlur={this.changeDistanceMeter}
            />
          </View>
          {/* <View style={styles.option}>
            <Text>Enable High Accuracy</Text>
            <Switch onValueChange={this.setAccuracy} value={highAccuracy} />
          </View> */}
        </View>
      </View>
    );
  }
}
export default SettingScreen;

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
  textInput: {
    backgroundColor: 'grey',
    borderColor: 'black',
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
