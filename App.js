import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AddNew from './components/add_new';
export default App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const Stack = createStackNavigator();

  useEffect(getListFromApi, []);

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

  function Item({name, id}) {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={setComplete.bind(this, id)}>
          <Text style={styles.title}>{name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function getListFromApi() {
    fetch('https://fierce-refuge-84728.herokuapp.com/items.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  function HomeScreen({navigation}) {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={({item}) => <Item name={item.name} id={item.id} />}
          keyExtractor={(item) => item.id.toString()}
        />

        <Button
          title="Add New"
          onPress={() => navigation.navigate('Add New')}
        />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={HomeScreen} />
        <Stack.Screen name="Add New" component={AddNew} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 50,
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
});
