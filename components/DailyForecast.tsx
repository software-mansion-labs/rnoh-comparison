import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeColors, spacing, useTheme} from '../theme';
import {DailyItem} from '../data/types';
import {formatTemp} from '../data/format';
import WeatherCard from './WeatherCard';
import WeatherIcon from './WeatherIcon';

const BAR_BORDER_RADIUS = 2;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
    },
    day: {
      width: 48,
      fontSize: 15,
      fontWeight: '500',
      color: colors.primary,
    },
    iconWrapper: {
      marginHorizontal: spacing.sm,
    },
    lowTemp: {
      width: 36,
      fontSize: 14,
      color: colors.secondary,
      textAlign: 'right',
    },
    barTrack: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: BAR_BORDER_RADIUS,
      marginHorizontal: spacing.sm,
    },
    barFill: {
      position: 'absolute',
      height: 4,
      backgroundColor: colors.accent.aqua,
      borderRadius: BAR_BORDER_RADIUS,
    },
    highTemp: {
      width: 36,
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
      textAlign: 'right',
    },
  });

type DayRowProps = {
  item: DailyItem;
  weeklyMin: number;
  range: number;
  showSeparator: boolean;
  styles: ReturnType<typeof createStyles>;
};

const DayRow = React.memo(function DayRow({
  item,
  weeklyMin,
  range,
  showSeparator,
  styles,
}: DayRowProps) {
  const left = ((item.low - weeklyMin) / range) * 100;
  const width = ((item.high - item.low) / range) * 100;

  return (
    <>
      {showSeparator && <View style={styles.separator} />}
      <View
        style={styles.row}
        accessibilityLabel={`${item.day}: High ${formatTemp(
          item.high,
        )}, Low ${formatTemp(item.low)}`}>
        <Text style={styles.day}>{item.day}</Text>
        <WeatherIcon icon={item.icon} size={28} style={styles.iconWrapper} />
        <Text style={styles.lowTemp}>{formatTemp(item.low)}</Text>
        <View
          style={styles.barTrack}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <View
            style={[
              styles.barFill,
              {left: `${left}%`, width: `${Math.max(width, 8)}%`},
            ]}
          />
        </View>
        <Text style={styles.highTemp}>{formatTemp(item.high)}</Text>
      </View>
    </>
  );
});

type Props = {
  data: DailyItem[];
};

const DailyForecast = React.memo(function DailyForecast({data}: Props) {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {weeklyMin, range} = useMemo(() => {
    const lows = data.map(d => d.low);
    const highs = data.map(d => d.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    return {weeklyMin: min, range: max - min || 1};
  }, [data]);

  return (
    <WeatherCard title="7-DAY FORECAST">
      {data.map((item, index) => (
        <DayRow
          key={item.id}
          item={item}
          weeklyMin={weeklyMin}
          range={range}
          showSeparator={index > 0}
          styles={styles}
        />
      ))}
    </WeatherCard>
  );
});

export default DailyForecast;
