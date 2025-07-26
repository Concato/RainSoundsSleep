import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

import Sound from 'react-native-sound';

// Permite múltiplos sons
Sound.setCategory('Playback');

// Som a partir da pasta `res/raw` — sem extensão
const sound = new Sound('rain', Sound.AndroidResource, (error) => {
  if (error) {
    console.log('Erro ao carregar som:', error);
  }
});

const { width } = Dimensions.get('window');

// Componente para ícones SVG simples
const CloudIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.cloud}>
      <View style={styles.cloudCircle1} />
      <View style={styles.cloudCircle2} />
      <View style={styles.cloudCircle3} />
      <View style={styles.cloudBase} />
    </View>
    <View style={styles.rainDrops}>
      <View style={[styles.rainDrop, { left: 8 }]} />
      <View style={[styles.rainDrop, { left: 15 }]} />
      <View style={[styles.rainDrop, { left: 22 }]} />
    </View>
  </View>
);

const TreeIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.treeTop} />
    <View style={styles.treeTrunk} />
  </View>
);

const ForestIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.forestContainer}>
      <View style={[styles.mountain, { left: 5 }]} />
      <View style={[styles.mountain, { left: 15 }]} />
      <View style={[styles.mountain, { left: 25 }]} />
      <View style={[styles.treeTrunk, { left: 12, top: 25 }]} />
      <View style={[styles.treeTrunk, { left: 22, top: 25 }]} />
    </View>
  </View>
);

const SnowflakeIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.snowflake}>
      <View style={styles.snowflakeLine1} />
      <View style={styles.snowflakeLine2} />
      <View style={styles.snowflakeLine3} />
    </View>
  </View>
);

const FireIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.flame}>
      <View style={styles.flameOuter} />
      <View style={styles.flameInner} />
    </View>
  </View>
);

const PlayButton = ({ onPress, isPlaying }) => (
  <TouchableOpacity style={styles.playButton} onPress={onPress}>
    <View style={styles.playIcon}>
      {!isPlaying ? (
        <View style={styles.triangle} />
      ) : (
        <View style={styles.pauseIcon}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const SoundItem = ({ icon, title, volume, onVolumeChange, isPlaying, onPlayPress }) => (
  <View style={styles.soundItem}>
    <LinearGradient
      colors={isPlaying ? ['#1e3a8a', '#1e40af'] : ['#1e293b', '#334155']}
      style={styles.soundItemGradient}
    >
      <View style={styles.soundItemContent}>
        <View style={styles.soundItemLeft}>
          {icon}
          <Text style={styles.soundTitle}>{title}</Text>
        </View>
        <View style={styles.soundItemCenter}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={volume}
            onValueChange={onVolumeChange}
            minimumTrackTintColor={isPlaying ? "#3b82f6" : "#64748b"}
            maximumTrackTintColor="#475569"
            thumbStyle={styles.sliderThumb}
          />
        </View>
        <View style={styles.soundItemRight}>
          <PlayButton onPress={onPlayPress} isPlaying={isPlaying} />
        </View>
      </View>
    </LinearGradient>
  </View>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('Relax');
  const [activeTimer, setActiveTimer] = useState('15 min');
  const [sounds, setSounds] = useState([
    { id: 1, title: 'Rain', volume: 50, isPlaying: true, icon: <CloudIcon /> },
    { id: 2, title: 'Ocean', volume: 30, isPlaying: false, icon: <TreeIcon /> },
    { id: 3, title: 'Forest', volume: 40, isPlaying: false, icon: <ForestIcon /> },
    { id: 4, title: 'Wind', volume: 35, isPlaying: false, icon: <SnowflakeIcon /> },
    { id: 5, title: 'Fire', volume: 25, isPlaying: false, icon: <FireIcon /> },
  ]);

  const playSound = () => {
    if (sound) {
      sound.play((success) => {
        if (success) {
          console.log('Som tocado com sucesso');
        } else {
          console.log('Erro ao tocar som');
        }
      });
    }
  }

  const tabs = ['Relax', 'Nature', 'White Noise', 'Urban'];
  const timers = ['15 min', '30 min', '1 h'];

  const updateSoundVolume = (id, volume) => {
    setSounds(sounds.map(sound => 
      sound.id === id ? { ...sound, volume } : sound
    ));
  };

  const togglePlaySound = (id) => {
    setSounds(sounds.map(sound => 
      sound.id === id ? { ...sound, isPlaying: !sound.isPlaying } : sound
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>RainSounds</Text>
          <TouchableOpacity style={styles.proButton}>
            <TouchableOpacity style={styles.proButton} onPress={playSound}>
        <Text style={styles.proButtonText}>▶ Tocar Chuva</Text>
      </TouchableOpacity>
            <Text style={styles.proButtonText}>PRO</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sound Items */}
        <ScrollView style={styles.soundList} showsVerticalScrollIndicator={false}>
          {sounds.map((sound) => (
            <SoundItem
              key={sound.id}
              icon={sound.icon}
              title={sound.title}
              volume={sound.volume}
              isPlaying={sound.isPlaying}
              onVolumeChange={(volume) => updateSoundVolume(sound.id, volume)}
              onPlayPress={() => togglePlaySound(sound.id)}
            />
          ))}
        </ScrollView>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.timerContainer}>
            <View style={styles.clockIcon}>
              <View style={styles.clockCircle}>
                <View style={styles.clockHand1} />
                <View style={styles.clockHand2} />
              </View>
            </View>
            <View style={styles.timerButtons}>
              {timers.map((timer) => (
                <TouchableOpacity
                  key={timer}
                  style={[
                    styles.timerButton,
                    activeTimer === timer && styles.activeTimerButton
                  ]}
                  onPress={() => setActiveTimer(timer)}
                >
                  <Text style={[
                    styles.timerButtonText,
                    activeTimer === timer && styles.activeTimerButtonText
                  ]}>
                    {timer}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.customText}>Custom</Text>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <View style={styles.saveIcon}>
              <View style={styles.saveIconRect} />
              <View style={styles.saveIconLines}>
                <View style={styles.saveIconLine} />
                <View style={styles.saveIconLine} />
                <View style={styles.saveIconLine} />
              </View>
            </View>
            <Text style={styles.saveButtonText}>Save Combination</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  proButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#64748b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  proButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#3b82f6',
  },
  soundList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  soundItem: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  soundItemGradient: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  soundItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  soundItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.3,
  },
  soundItemCenter: {
    flex: 0.5,
    paddingHorizontal: 15,
  },
  soundItemRight: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  soundTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#ffffff',
    width: 20,
    height: 20,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  playIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: '#ffffff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  pauseIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 10,
  },
  pauseBar: {
    width: 3,
    height: 12,
    backgroundColor: '#ffffff',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  clockIcon: {
    marginRight: 15,
  },
  clockCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clockHand1: {
    position: 'absolute',
    width: 1,
    height: 6,
    backgroundColor: '#64748b',
    top: 2,
  },
  clockHand2: {
    position: 'absolute',
    width: 1,
    height: 4,
    backgroundColor: '#64748b',
    top: 4,
    transform: [{ rotate: '90deg' }],
  },
  timerButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  timerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  activeTimerButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  timerButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTimerButtonText: {
    color: '#ffffff',
  },
  customText: {
    color: '#64748b',
    fontSize: 14,
    marginLeft: 10,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  saveIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  saveIconRect: {
    width: 16,
    height: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 2,
  },
  saveIconLines: {
    marginLeft: 4,
  },
  saveIconLine: {
    width: 8,
    height: 1,
    backgroundColor: '#ffffff',
    marginBottom: 1,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  // Icon styles
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloud: {
    position: 'relative',
    width: 30,
    height: 20,
  },
  cloudCircle1: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    left: 2,
    top: 4,
  },
  cloudCircle2: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    left: 8,
    top: 0,
  },
  cloudCircle3: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    left: 18,
    top: 2,
  },
  cloudBase: {
    position: 'absolute',
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    left: 2,
    top: 8,
  },
  rainDrops: {
    position: 'absolute',
    top: 25,
    width: 30,
    height: 10,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  treeTop: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 2,
  },
  treeTrunk: {
    width: 4,
    height: 12,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
  },
  forestContainer: {
    width: 35,
    height: 35,
    position: 'relative',
  },
  mountain: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
    top: 5,
  },
  snowflake: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  snowflakeLine1: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#ffffff',
  },
  snowflakeLine2: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '60deg' }],
  },
  snowflakeLine3: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '120deg' }],
  },
  flame: {
    width: 20,
    height: 25,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameOuter: {
    position: 'absolute',
    width: 16,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    bottom: 0,
  },
  flameInner: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#0f172a',
    bottom: 4,
  },
});

export default App;

