import 'react-native-gesture-handler';
import React, {useEffect, useState, useCallback} from 'react';
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
import {NavigationContainer, useLinking} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AddNew from './components/add_new';
import {useFocusEffect} from '@react-navigation/native';

export default App = () => {
  const [isReady, setIsReady] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const Stack = createStackNavigator();
  const ref = React.useRef();
  const {getInitialState} = useLinking(ref, {
    prefixes: ['shoppinglist://'],
  });
  const [initialState, setInitialState] = React.useState();

  useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise((resolve) =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150),
      ),
    ])
      .catch((e) => {
        console.error(e);
      })
      .then((state) => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

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

        <Button
          title="Add New"
          onPress={() => navigation.navigate('Add New')}
        />
      </SafeAreaView>
    );
  }
  return (
    <NavigationContainer initialState={initialState} ref={ref}>
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
