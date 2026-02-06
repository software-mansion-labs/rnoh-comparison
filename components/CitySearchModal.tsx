import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ThemeColors, borderRadius, spacing, useTheme} from '../theme';
import {CityResult, DEFAULT_CITIES, searchCities} from '../data/weatherApi';

type Props = {
  visible: boolean;
  onSelect: (city: CityResult) => void;
  onClose: () => void;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      padding: spacing.lg,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    close: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.accent.aqua,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      color: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchButton: {
      backgroundColor: colors.accent.aqua,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    searchButtonPressed: {
      opacity: 0.7,
    },
    searchButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.background,
    },
    loader: {
      marginVertical: spacing.xxl,
    },
    cityRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
    },
    cityRowPressed: {
      opacity: 0.7,
    },
    cityName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    cityCountry: {
      fontSize: 12,
      color: colors.secondary,
      marginTop: 2,
    },
    errorText: {
      fontSize: 14,
      color: colors.accent.red,
      textAlign: 'center',
      marginVertical: spacing.lg,
    },
    emptyText: {
      fontSize: 14,
      color: colors.secondary,
      textAlign: 'center',
      marginVertical: spacing.lg,
    },
  });

type CityRowProps = {
  city: CityResult;
  onSelect: (city: CityResult) => void;
  styles: ReturnType<typeof createStyles>;
};

const CityRow = React.memo(function CityRow({
  city,
  onSelect,
  styles,
}: CityRowProps) {
  const handlePress = useCallback(() => onSelect(city), [city, onSelect]);

  return (
    <Pressable
      style={({pressed}) => [styles.cityRow, pressed && styles.cityRowPressed]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${city.name}${
        city.country ? `, ${city.country}` : ''
      }`}>
      <View>
        <Text style={styles.cityName}>{city.name}</Text>
        {city.country ? (
          <Text style={styles.cityCountry}>{city.country}</Text>
        ) : null}
      </View>
    </Pressable>
  );
});

const CitySearchModal = React.memo(function CitySearchModal({
  visible,
  onSelect,
  onClose,
}: Props) {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<CityResult[]>(DEFAULT_CITIES);
  const [searchError, setSearchError] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults(DEFAULT_CITIES);
      setSearchError(false);
      return;
    }
    setSearching(true);
    setSearchError(false);
    try {
      const cities = await searchCities(query.trim());
      setResults(cities);
    } catch {
      setSearchError(true);
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleSelect = useCallback(
    (city: CityResult) => {
      setQuery('');
      setResults(DEFAULT_CITIES);
      setSearchError(false);
      onSelect(city);
    },
    [onSelect],
  );

  const handleClose = useCallback(() => {
    setQuery('');
    setResults(DEFAULT_CITIES);
    setSearchError(false);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close search"
        />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Search Cities</Text>
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close search">
              <Text style={styles.close}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Search city..."
              placeholderTextColor={colors.secondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              accessibilityLabel="Search for a city"
            />
            <Pressable
              style={({pressed}) => [
                styles.searchButton,
                pressed && styles.searchButtonPressed,
              ]}
              onPress={handleSearch}
              accessibilityRole="button"
              accessibilityLabel="Search">
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>
          <ScrollView>
            {searching ? (
              <ActivityIndicator
                size="large"
                color={colors.accent.aqua}
                style={styles.loader}
              />
            ) : searchError ? (
              <Text style={styles.errorText}>
                Search failed. Please try again.
              </Text>
            ) : results.length === 0 ? (
              <Text style={styles.emptyText}>No cities found.</Text>
            ) : (
              results.map(city => (
                <CityRow
                  key={`${city.name}-${city.latitude}`}
                  city={city}
                  onSelect={handleSelect}
                  styles={styles}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

export default CitySearchModal;
