import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Text,
} from 'react-native';

function HomeScreen({navigation}) {
  const [data, setData] = useState([]);
  React.useEffect(getListFromApi, []);
  function Item({name, id}) {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={setComplete.bind(this, id)}>
          <Text style={styles.title}>{name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function setComplete(item) {
    return fetch(`https://fierce-refuge-84728.herokuapp.com/items/${item}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'complete',
      }),
    })
      .then((response) => response.json())
      .then(getListFromApi)
      .catch((error) => {
        console.error(error);
      });
  }

  function getListFromApi() {
    fetch('https://fierce-refuge-84728.herokuapp.com/items.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListFromApi();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => <Item name={item.name} id={item.id} />}
        keyExtractor={(item) => item.id.toString()}
      />

      <Button title="Add New" onPress={() => navigation.navigate('Add New')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#3B33A4',
    marginVertical: 3,
    marginHorizontal: 16,
    height: 40,
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
});

export default HomeScreen;
