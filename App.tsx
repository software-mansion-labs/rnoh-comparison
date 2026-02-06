import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ThemeColors, ThemeProvider, spacing, useTheme} from './theme';
import {CityWeather} from './data/types';
import {CityResult, DEFAULT_CITIES, fetchWeather} from './data/weatherApi';
import HeaderBar from './components/HeaderBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetails from './components/WeatherDetails';
import CitySearchModal from './components/CitySearchModal';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: spacing.xxl,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16,
      color: colors.secondary,
    },
  });

function AppContent(): React.JSX.Element {
  const {colors, isDark} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [currentCity, setCurrentCity] = useState<CityResult>(DEFAULT_CITIES[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadWeather = useCallback(async (city: CityResult) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(
        city.latitude,
        city.longitude,
        city.name,
        controller.signal,
      );
      setWeather(data);
    } catch (e) {
      if (controller.signal.aborted) {
        return;
      }
      setError(e instanceof Error ? e.message : 'Failed to load weather data.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadWeather(currentCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadWeather]);

  const handleCitySelect = useCallback(
    (city: CityResult) => {
      setSearchVisible(false);
      setCurrentCity(city);
      loadWeather(city);
    },
    [loadWeather],
  );

  const handleRefresh = useCallback(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  const openSearch = useCallback(() => setSearchVisible(true), []);
  const closeSearch = useCallback(() => setSearchVisible(false), []);

  if (loading && !weather) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.accent.aqua} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !weather) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loader}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={colors.accent.aqua}
          />
        }>
        <HeaderBar
          cityName={currentCity.name}
          onCityPress={openSearch}
          onRefresh={handleRefresh}
          loading={loading}
        />
        <CurrentWeather weather={weather!} />
        <HourlyForecast data={weather!.hourly} />
        <DailyForecast data={weather!.daily} />
        <WeatherDetails weather={weather!} />
      </ScrollView>
      <CitySearchModal
        visible={searchVisible}
        onSelect={handleCitySelect}
        onClose={closeSearch}
      />
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
