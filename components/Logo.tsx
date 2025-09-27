import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  useImage?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium',
  color = '#FFFFFF',
  useImage = false
}) => {
  const fontSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
  const imageSize = size === 'small' ? 180 : size === 'large' ? 280 : 220;
  
  if (useImage) {
    return (
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/main-logo-white.png')}
          style={[styles.logoImage, { width: imageSize, height: imageSize * 0.6 }]}
          resizeMode="contain"
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.logoText, { fontSize, color }]}>Enrique Diaz Coaching</Text>
      <View style={[styles.circle, { borderColor: color }]}>
        <View style={[styles.innerCircle, { backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 0,
  },
  logoText: {
    fontWeight: '700',
    marginRight: 8,
  },
  logoImage: {
    // Image styling will be applied inline
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});

export default Logo;