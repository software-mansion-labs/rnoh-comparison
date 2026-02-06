import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ThemeColors, spacing, useTheme} from '../theme';
import {HourlyItem} from '../data/types';
import {formatTemp} from '../data/format';
import WeatherCard from './WeatherCard';
import WeatherIcon from './WeatherIcon';

type HourItemProps = {
  time: string;
  temp: number;
  icon: string;
  styles: ReturnType<typeof createStyles>;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    hour: {
      alignItems: 'center',
      marginRight: spacing.xl,
      minWidth: 48,
      gap: spacing.xs,
    },
    time: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.secondary,
    },
    temp: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.primary,
    },
  });

const HourItem = React.memo(function HourItem({
  time,
  temp,
  icon,
  styles,
}: HourItemProps) {
  return (
    <View
      style={styles.hour}
      accessibilityLabel={`${time}: ${formatTemp(temp)}`}>
      <Text style={styles.time}>{time}</Text>
      <WeatherIcon icon={icon} size={32} />
      <Text style={styles.temp}>{formatTemp(temp)}</Text>
    </View>
  );
});

type Props = {
  data: HourlyItem[];
};

const HourlyForecast = React.memo(function HourlyForecast({data}: Props) {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <WeatherCard title="HOURLY FORECAST">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map(item => (
          <HourItem
            key={item.id}
            time={item.time}
            temp={item.temp}
            icon={item.icon}
            styles={styles}
          />
        ))}
      </ScrollView>
    </WeatherCard>
  );
});

export default HourlyForecast;
