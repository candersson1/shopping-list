import React, {useState} from 'react';
import {TextInput, View, Button} from 'react-native';

export default function AddNew({navigation}) {
  const [text, setText] = useState('');

  return (
    <View
      style={{
        padding: 10,
        display: 'flex',
        alignItems: 'center',
      }}>
      <TextInput
        style={{
          marginTop: 40,
          marginBottom: 40,
          height: 40,
          width: 300,
          borderBottomWidth: 2,
        }}
        placeholder="What do we need?"
        onChangeText={(text) => setText(text)}
        defaultValue={text}
      />
      <Button
        style={{backgroundColor: 'red'}}
        onPress={submitToApi.bind(this, text)}
        title="Add"
        color="#841584"
      />
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
