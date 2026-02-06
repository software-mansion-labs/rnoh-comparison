import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {iconUrl} from '../data/format';
import {ThemeColors, useTheme} from '../theme';

type Props = {
  icon: string;
  size: number;
  style?: StyleProp<ViewStyle>;
};

const createStyles = (colors: ThemeColors, size: number) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {width: size, height: size},
    text: {fontSize: size * 0.4, color: colors.secondary},
  });

const WeatherIcon = React.memo(function WeatherIcon({
  icon,
  size,
  style,
}: Props) {
  const {colors} = useTheme();
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);

  useEffect(() => {
    setFailed(false);
  }, [icon]);

  const styles = useMemo(() => createStyles(colors, size), [colors, size]);

  return (
    <View style={[styles.container, style]}>
      {failed ? (
        <Text style={styles.text}>--</Text>
      ) : (
        <Image
          source={{uri: iconUrl(icon)}}
          style={styles.image}
          onError={handleError}
        />
      )}
    </View>
  );
});

export default WeatherIcon;
