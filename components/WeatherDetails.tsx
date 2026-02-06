import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeColors, borderRadius, spacing, useTheme} from '../theme';
import {CityWeather} from '../data/types';
import {formatTemp} from '../data/format';

type DetailItem = {
  id: string;
  label: string;
  value: string;
};

type Section = {
  title: string;
  data: DetailItem[];
};

type Props = {
  weather: CityWeather;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      color: colors.secondary,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.secondary,
      letterSpacing: 0.5,
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.primary,
    },
    sectionGap: {
      height: spacing.sm,
    },
  });

const WeatherDetails = React.memo(function WeatherDetails({weather}: Props) {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const sections: Section[] = useMemo(
    () => [
      {
        title: 'CONDITIONS',
        data: [
          {
            id: 'uv',
            label: 'UV INDEX',
            value: `${weather.uvIndex} ${weather.uvLabel}`,
          },
          {
            id: 'feels',
            label: 'FEELS LIKE',
            value: formatTemp(weather.feelsLike),
          },
          {id: 'humidity', label: 'HUMIDITY', value: `${weather.humidity}%`},
        ],
      },
      {
        title: 'ATMOSPHERE',
        data: [
          {id: 'wind', label: 'WIND', value: weather.wind},
          {id: 'visibility', label: 'VISIBILITY', value: weather.visibility},
          {id: 'pressure', label: 'PRESSURE', value: weather.pressure},
        ],
      },
      {
        title: 'SUN',
        data: [
          {id: 'sunrise', label: 'SUNRISE', value: weather.sunrise},
          {id: 'sunset', label: 'SUNSET', value: weather.sunset},
        ],
      },
    ],
    [weather],
  );

  return (
    <View style={styles.wrapper}>
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={section.title}>
          {sectionIndex > 0 && <View style={styles.sectionGap} />}
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.data.map(item => (
            <View
              key={item.id}
              style={styles.detailRow}
              accessibilityLabel={`${item.label}: ${item.value}`}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </React.Fragment>
      ))}
    </View>
  );
});

export default WeatherDetails;
