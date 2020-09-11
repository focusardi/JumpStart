/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, Text, View, PermissionsAndroid} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import SettingScreen from './screens/settingScreen';
import StartScreen from './screens/startScreen';
import SessionScreen from './screens/sessionScreen';
import SessionDetailScreen from './screens/sessionDetailScreen';
import NewStartScreen from './screens/newStartScreen';
//import RequestAndroidGPSPermission from './helpers/requestAndroidGPSPermission';
import GPSLocationNow from './helpers/gpsUtils';

import rootReducer from './reducers/rootReducer';

const store = createStore(rootReducer);

const Stack = createStackNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Startgps" onPress={GPSLocationNow} />
      <Button title="Start" onPress={() => navigation.navigate('Start')} />
      <Text>Home Screen</Text>
      <Button title="settings" onPress={() => navigation.navigate('Setting')} />
      <Text>Home Screen2</Text>
      <Button title="sessions" onPress={() => navigation.navigate('Session')} />
      <Text>Home Screen2</Text>
      <Button
        title="NewStart"
        onPress={() => navigation.navigate('NewStart')}
      />
    </View>
  );
};
const ProfileScreen = () => {
  return <Text>This is Jane's profile</Text>;
};
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} />
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Session" component={SessionScreen} />
          <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
          <Stack.Screen name="NewStart" component={NewStartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
