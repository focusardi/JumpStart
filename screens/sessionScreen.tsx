import React from 'react';
import {Text, View, Button} from 'react-native';

const SessionScreen = ({navigation}) => {
  console.log(navigation);
  return (
    <View>
      <Text>session Screen</Text>
      <Button
        title="Go to detail"
        onPress={() => navigation.navigate('SessionDetail')}
      />
    </View>
  );
};
export default SessionScreen;
