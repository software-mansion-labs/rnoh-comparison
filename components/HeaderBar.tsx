import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {ThemeColors, spacing, useTheme} from '../theme';

type Props = {
  cityName: string;
  onCityPress: () => void;
  onRefresh: () => void;
  loading: boolean;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    cityName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    refreshButton: {
      padding: spacing.xs,
    },
    refreshText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.accent.aqua,
    },
  });

const HeaderBar = React.memo(function HeaderBar({
  cityName,
  onCityPress,
  onRefresh,
  loading,
}: Props) {
  const {colors, isDark, toggleTheme} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onCityPress}
        accessibilityRole="button"
        accessibilityLabel={`Current city: ${cityName}`}
        accessibilityHint="Opens city search">
        <Text style={styles.cityName}>{cityName}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{false: colors.border, true: colors.accent.aqua}}
          thumbColor={colors.primary}
          accessibilityLabel={
            isDark ? 'Switch to light theme' : 'Switch to dark theme'
          }
        />
        <Pressable
          style={styles.refreshButton}
          onPress={onRefresh}
          accessibilityRole="button"
          accessibilityLabel="Refresh weather data">
          {loading ? (
            <ActivityIndicator size="small" color={colors.accent.aqua} />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
});

export default HeaderBar;
