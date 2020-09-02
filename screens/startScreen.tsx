import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SpeedMeter from '../components/speedMeter';
import TestMeter from '../components/test';
const CenterSpeedMeter = [
  {
    id: 'getCurrentPosition',
    title: 'Geolocation.getCurrentPosition',
    description: 'Asynchronously load and observe location',
    render() {
      return <SpeedMeter />;
    },
  },
];

class StartScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      nowSpeed: 0,
    };
  }

  render() {
    const {nowSpeed} = this.state;
    return (
      <View>
        <Text>Start Screen test</Text>
        <SpeedMeter />

        <Text>{this.state.nowSpeed} KM/h</Text>
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
export default StartScreen;

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
