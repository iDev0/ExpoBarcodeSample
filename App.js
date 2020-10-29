import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from "expo-barcode-scanner";


const delay = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })
}

export default function App() {

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    setItems([
      ...items,
      {
        id : items.length,
        barcode : data
      }
    ])

    await delay(2000)
    setScanned(false)

    // setTimeout(() => {
    //   console.log(items.forEach(item => console.log(item)))
    //   setScanned(false)
    // }, 2000)

  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={ scanned ? undefined : handleBarCodeScanned }
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}>
          </View>
          { scanned &&
          <Button
            title={'Tap to Scan Again'}
            onPress={() => setScanned(false)}
            style={{width: 100, height: 100}} /> }
          <View style={{ position: 'absolute'}}>
            { items.map(item =>
              <Text key={item.id} style={{ color : 'white', fontSize : 15}}>{item.barcode}</Text>
            )}
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
  },
});
