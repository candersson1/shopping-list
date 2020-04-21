import React, {Component, useState} from 'react';
import {Text, TextInput, View, Button} from 'react-native';

export default function AddNew({navigation}) {
  const [text, setText] = useState('');

  return (
    <View style={{padding: 10}}>
      <TextInput
        style={{height: 40}}
        placeholder="What do we need?"
        onChangeText={(text) => setText(text)}
        defaultValue={text}
      />
      <Button
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
      .then(navigation.navigate('List'))
      .catch((error) => {
        console.error(error);
      });
  }
}
