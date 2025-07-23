import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

type SoundName = 'rain' | 'forest' | 'ocean' | 'fire';

const sounds: Record<SoundName, any> = {
  rain: require('./assets/sounds/rain-sound.mp3'),
  forest: require('./assets/sounds/forest-ambience.mp3'),
  ocean: require('./assets/sounds/ocean-waves.mp3'),
  fire: require('./assets/sounds/firewood-burning-sound.mp3'),
};

const App = () => {
  const [timer, setTimer] = useState('');
  const [selectedSound, setSelectedSound] = useState<SoundName>('rain');

  useEffect(() => {
    const init = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    };
    init();
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  const playSound = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: 'sound',
      url: sounds[selectedSound],
      title: selectedSound,
      isLooping: true,
    });
    await TrackPlayer.play();

    const minutes = parseInt(timer);
    if (!isNaN(minutes) && minutes > 0) {
      setTimeout(() => stopSound(), minutes * 60 * 1000);
    }
  };

  const stopSound = async () => {
    await TrackPlayer.stop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rain Sounds Sleep</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.soundList}
        contentContainerStyle={styles.soundListContent}
      >
        {Object.keys(sounds).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.soundButton,
              selectedSound === key && styles.soundButtonSelected,
            ]}
            onPress={() => setSelectedSound(key as SoundName)}
          >
            <Text style={styles.soundText}>{key.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        placeholder="Timer (min)"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="numeric"
        value={timer}
        onChangeText={setTimer}
      />

      <TouchableOpacity style={styles.playButton} onPress={playSound}>
        <Text style={styles.playButtonText}>▶ Play</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
        <Text style={styles.stopButtonText}>⏹ Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
  },
  soundList: {
    maxHeight: 60,
    marginBottom: 20,
  },
  soundListContent: {
    gap: 12,
    paddingHorizontal: 10,
  },
  soundButton: {
    backgroundColor: '#21262d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  soundButtonSelected: {
    backgroundColor: '#238636',
  },
  soundText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    width: 200,
    textAlign: 'center',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#238636',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
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
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
