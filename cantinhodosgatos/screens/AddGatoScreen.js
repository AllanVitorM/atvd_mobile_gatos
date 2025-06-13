import React, { useEffect, useState } from 'react';
import { View, Image, Alert, StatusBar, Animated, Easing } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://192.168.0.105:3000';

export default function AddCarScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const dropAnim = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    const animateLoop = () => {
      Animated.sequence([
        Animated.timing(dropAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(dropAnim, {
          toValue: -100,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(animateLoop, 1000);
      });
    };

    animateLoop();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } else {
        Alert.alert('Permissão de localização negada');
      }
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a câmera foi negada!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cor', cor);

    if (image) {
      formData.append('photo', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }

    if (location) {
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
    }

    try {
      await fetch(`${API_URL}/gatospost`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro ao salvar carro', error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#F5F7FA', 
        justifyContent: 'center',
      }}
    >
      <Animated.Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FF6B6B', 
          alignSelf: 'center',
          marginBottom: 20,
          transform: [{ translateY: dropAnim }],
        }}
      >
        Cantinho dos gatos
      </Animated.Text>

      <Card style={{ backgroundColor: '#FFFFFF', padding: 15 }}>
        <Card.Content>
          <TextInput
            label="Nome do gato"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: '#FFB385', underlineColor: 'transparent' } }} 
          />
          <TextInput
            label="Cor do gato"
            value={cor}
            onChangeText={setCor}
            mode="outlined"
            multiline
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: '#FFB385', underlineColor: 'transparent' } }} 
          />
          <Button
            icon="camera"
            mode="outlined"
            onPress={pickImage}
            style={{ marginBottom: 10, borderColor: '#FF6B6B' }}
            textColor="#FF6B6B"
          >
            Tirar Foto
          </Button>
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                marginBottom: 10,
                borderColor: '#E6CCFF',
                borderWidth: 2,
              }}
            />
          )}
          <Button
            mode="contained"
            onPress={handleSubmit}
            buttonColor="#FF6B6B"
            textColor="#000"
          >
            Salvar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
