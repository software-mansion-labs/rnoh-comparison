import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeColors, borderRadius, spacing, useTheme} from '../theme';

type Props = {
  title?: string;
  children: React.ReactNode;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      padding: spacing.lg,
    },
    title: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      color: colors.secondary,
      marginBottom: spacing.md,
    },
  });

const WeatherCard = React.memo(function WeatherCard({title, children}: Props) {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
});

export default WeatherCard;
