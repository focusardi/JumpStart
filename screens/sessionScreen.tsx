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
import {ExecuteQuery} from '../helpers/dbUtil';

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.title}</Text>
  </TouchableOpacity>
);

class SessionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.getDataList();
  }

  state = {
    DATA: [{id: 0, title: '123'}],
  };

  getDataList = async () => {
    let selectQuery = await ExecuteQuery(
      'SELECT SESSION_ID, SESSION_START_TIME FROM SESSIONS',
      [],
    );
    console.log(selectQuery);
    var rows = selectQuery.rows;
    this.state.DATA.pop();
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      console.log(item);      
      var data = {
        id: item.SESSION_ID,
        title: item.SESSION_START_TIME ? item.SESSION_START_TIME : 'AA',
      };
      this.state.DATA.push(data);
    }
    console.log(this.state.DATA);
  };
  //const [selectedId, setSelectedId] = useState(null);

  render() {
    const {navigation} = this.props;
    const renderItem = ({item}) => {
      //const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';

      return (
        <Item
          item={item}
          onPress={() => navigation.navigate('SessionDetail', {item: item})}
          //style={{backgroundColor}}
        />
      );
    };

    return (
      <View>
        <Text>session Screen</Text>
        {/* <Button
          title="Go to detail"
          onPress={() => navigation.navigate('SessionDetail')}
        /> */}
        <FlatList
          data={this.state.DATA}
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
