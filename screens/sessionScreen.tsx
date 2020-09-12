import React from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];


const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.title}</Text>
  </TouchableOpacity>
);

class SessionScreen extends React.Component {
  

  //const [selectedId, setSelectedId] = useState(null);
  
  render() {
    const {navigation} = this.props;
    const renderItem = ({item}) => {
      //const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
  
      return (
        <Item
          item={item}
          onPress={() => navigation.navigate('SessionDetail', {item:item})}
          //style={{backgroundColor}}
        />
      );
    };

    return (
      <View>
        <Text>session Screen</Text>
        <Button
          title="Go to detail"
          onPress={() => navigation.navigate('SessionDetail')}
        />
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          //extraData={selectedId}
        />
      </View>
    );
  }
};
export default SessionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
