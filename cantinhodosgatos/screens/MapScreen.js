import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.105:3000';

export default function MapScreen() {
  const [gato, setGato] = useState([]);
  const [region, setRegion] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_URL}/gatos`);
      const data = await res.json();
      setCars(data);

      if (data.length > 0) {
        const avgLat = data.reduce((sum, p) => sum + Number(p.latitude), 0) / data.length;
        const avgLng = data.reduce((sum, p) => sum + Number(p.longitude), 0) / data.length;

        setRegion({
          latitude: avgLat,
          longitude: avgLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    };

    fetchData();
  }, []);

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: '#F5F7FA' }}>
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {gato.map((p) => (
          <Marker
            key={p._id}
            coordinate={{ latitude: Number(p.latitude), longitude: Number(p.longitude) }}
            title={p.nome}
            description={p.cor}
            pinColor="#FFB385" 
          />
        ))}
      </MapView>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#A3D2CA', 
          zIndex: 1,
        }}
        iconColor="#FFFFFF"
      />
    </View>
  );
}
