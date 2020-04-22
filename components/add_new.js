import React, {useState} from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default function AddNew({navigation}) {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What do we need?"
        onChangeText={(text) => setText(text)}
        defaultValue={text}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={submitToApi.bind(this, text)}>
        <Text style={styles.button_text}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  function submitToApi(text) {
    return fetch(`https://fierce-refuge-84728.herokuapp.com/items`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'active',
        name: text,
      }),
    })
      .then((response) => response.json())
      .then(setText(''))
      .then(navigation.navigate('List'))
      .catch((error) => {
        console.error(error);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginTop: 40,
    marginBottom: 40,
    height: 40,
    width: 300,
    borderBottomWidth: 2,
  },
  button: {
    width: '50%',
    backgroundColor: '#74d358',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  button_text: {
    color: 'white',
    fontSize: 24,
  },
});
