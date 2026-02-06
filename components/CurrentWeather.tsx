import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeColors, spacing, useTheme} from '../theme';
import {CityWeather} from '../data/types';
import {formatTemp} from '../data/format';
import WeatherIcon from './WeatherIcon';

type Props = {
  weather: CityWeather;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
    },
    temp: {
      fontSize: 80,
      fontWeight: '200',
      color: colors.primary,
      lineHeight: 90,
    },
    conditionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    condition: {
      fontSize: 16,
      color: colors.secondary,
    },
    hiLo: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.primary,
      marginTop: spacing.xs,
    },
  });

const CurrentWeather = React.memo(function CurrentWeather({weather}: Props) {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={styles.container}
      accessibilityLabel={`${formatTemp(weather.temp)}, ${
        weather.condition
      }. High ${formatTemp(weather.high)}, Low ${formatTemp(weather.low)}`}>
      <Text style={styles.temp}>{formatTemp(weather.temp)}</Text>
      <View style={styles.conditionRow}>
        <WeatherIcon icon={weather.icon} size={36} />
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>
      <Text style={styles.hiLo}>
        H:{formatTemp(weather.high)} L:{formatTemp(weather.low)}
      </Text>
    </View>
  );
});

export default CurrentWeather;
