import { useEffect, useState } from 'react';
import { View, FlatList, Image, StatusBar } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.105:3000';

export default function HomeScreen() {
  const [gato, setGato] = useState([]);
  const navigation = useNavigation();

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/gato`);
    const data = await res.json();
    setCars(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: '##F5F7FA	' }}>
      <FlatList
        data={gato}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={{ margin: 10, backgroundColor: '#FFFFFF	' }}>
            <Card.Content>
              <Title style={{ color: '#FFB385' }}>{item.nome}</Title>
              <Paragraph style={{ color: '#444444' }}>{item.cor}</Paragraph>
            </Card.Content>
            {item.photo && (
              <Card.Cover source={{ uri: `${API_URL}/uploads/${item.photo}` }} style={{ borderRadius: 8 }} />
            )}
          </Card>
        )}
      />
      <FAB icon="plus" style={{ position: 'absolute', bottom: 80, right: 20, backgroundColor: '#FF6B6B' }} onPress={() => navigation.navigate('Add Gato')} />
      <FAB icon="map" style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#A3D2CA' }} onPress={() => navigation.navigate('Mapa')} />
    </View>
  );
}
