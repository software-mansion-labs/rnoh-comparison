import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleProp, Text, View, ViewStyle} from 'react-native';
import {iconUrl} from '../data/format';
import {useTheme} from '../theme';

type Props = {
  icon: string;
  size: number;
  style?: StyleProp<ViewStyle>;
};

const WeatherIcon = React.memo(function WeatherIcon({
  icon,
  size,
  style,
}: Props) {
  const {colors} = useTheme();
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);

  const styles = useMemo(
    () => ({
      container: {
        width: size,
        height: size,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
      image: {width: size, height: size},
      text: {fontSize: size * 0.4, color: colors.secondary},
    }),
    [size, colors.secondary],
  );

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
