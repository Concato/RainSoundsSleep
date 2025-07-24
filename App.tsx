import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

const sounds = [
  { id: 'rain', title: 'Chuva', file: require('./assets/sounds/rain-sound.mp3') },
  { id: 'forest', title: 'Floresta', file: require('./assets/sounds/forest-ambience.mp3') },
  { id: 'ocean', title: 'Oceano', file: require('./assets/sounds/ocean-waves.mp3') },
  { id: 'fire', title: 'Fogueira', file: require('./assets/sounds/firewood-burning-sound.mp3') },
];

const presetTimers = [5, 10, 15, 30, 60];

const App = () => {
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [customTimerModal, setCustomTimerModal] = useState(false);
  const [customTimer, setCustomTimer] = useState('');
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    };
    init();
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  const toggleSound = async (id: string) => {
    let updatedSelection = [...selectedSounds];
    if (selectedSounds.includes(id)) {
      updatedSelection = selectedSounds.filter((s) => s !== id);
    } else {
      updatedSelection.push(id);
    }
    setSelectedSounds(updatedSelection);
  };

  const play = async () => {
    await TrackPlayer.reset();
    for (const id of selectedSounds) {
      const sound = sounds.find((s) => s.id === id);
      if (sound) {
        await TrackPlayer.add({
          id: sound.id,
          url: sound.file,
          title: sound.title,
          isLooping: true,
        });
      }
    }
    await TrackPlayer.play();
    if (timer) {
      setTimeout(() => stop(), timer * 60 * 1000);
    }
  };

  const stop = async () => {
    await TrackPlayer.stop();
  };

  const renderTimerModal = () => (
    <Modal transparent visible={customTimerModal} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tempo personalizado (min)</Text>
          <TextInput
            placeholder="Ex: 25"
            keyboardType="numeric"
            value={customTimer}
            onChangeText={setCustomTimer}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              setTimer(parseInt(customTimer));
              setCustomTimerModal(false);
            }}
          >
            <Text style={styles.playButtonText}>Definir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rain Sounds Sleep</Text>

      <FlatList
        data={sounds}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.soundGrid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.soundTile, selectedSounds.includes(item.id) && styles.soundTileActive]}
            onPress={() => toggleSound(item.id)}
          >
            <Text style={styles.soundText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={{ color: '#fff', marginTop: 20 }}>Timer:</Text>
      <ScrollView horizontal contentContainerStyle={styles.timerRow}>
        {presetTimers.map((min) => (
          <TouchableOpacity key={min} style={styles.timerBtn} onPress={() => setTimer(min)}>
            <Text style={{ color: '#fff' }}>{min} min</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.timerBtn, { borderColor: '#58a6ff' }]}
          onPress={() => setCustomTimerModal(true)}
        >
          <Text style={{ color: '#58a6ff' }}>Personalizado</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.playButton} onPress={play}>
        <Text style={styles.playButtonText}>▶ Play</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopButton} onPress={stop}>
        <Text style={styles.stopButtonText}>⏹ Stop</Text>
      </TouchableOpacity>

      {renderTimerModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  soundGrid: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  soundTile: {
    backgroundColor: '#21262d',
    padding: 20,
    borderRadius: 20,
    width: 150,
    margin: 10,
    alignItems: 'center',
  },
  soundTileActive: {
    backgroundColor: '#238636',
  },
  soundText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    width: 100,
    textAlign: 'center',
    marginVertical: 10,
  },
  playButton: {
    backgroundColor: '#238636',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#da3633',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  timerRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    gap: 10,
  },
  timerBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#161b22',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default App;
