import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer, useLinking} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AddNew from './components/add_new';
import HomeScreen from './components/home_screen';

export default App = () => {
  const Stack = createStackNavigator();
  const ref = React.useRef();
  const config = {
    List: {
      path: 'stack',
      initialRouteName: 'List',
      screens: {
        List: 'list',
        AddNew: 'add_new',
      },
    },
  };
  const {getInitialState} = useLinking(ref, {
    prefixes: ['shoppinglist://'],
    config,
  });
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = React.useState(false);
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
  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={ref}
      initialRouteName="List">
      <Stack.Navigator>
        <Stack.Screen
          name="List"
          component={HomeScreen}
          options={{headerLeft: null}}
        />
        <Stack.Screen name="Add New" component={AddNew} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
