import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import Colors from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button, styles[size]];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        if (disabled) baseStyle.push(styles.primaryDisabled);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        if (disabled) baseStyle.push(styles.secondaryDisabled);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        if (disabled) baseStyle.push(styles.outlineDisabled);
        break;
      case 'text':
        baseStyle.push(styles.textButton);
        if (disabled) baseStyle.push(styles.textDisabled);
        break;
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle: TextStyle[] = [styles.buttonText, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        if (disabled) baseStyle.push(styles.outlineTextDisabled);
        break;
      case 'text':
        baseStyle.push(styles.textButtonText);
        if (disabled) baseStyle.push(styles.textButtonTextDisabled);
        break;
    }
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.text.white : Colors.primary} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  buttonText: {
    fontWeight: '600',
  },
  // Primary button
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryDisabled: {
    backgroundColor: Colors.primary + '80', // 50% opacity
  },
  primaryText: {
    color: Colors.text.white,
  },
  // Secondary button
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  secondaryDisabled: {
    backgroundColor: Colors.secondary + '80', // 50% opacity
  },
  secondaryText: {
    color: Colors.text.primary,
  },
  // Outline button
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  outlineDisabled: {
    borderColor: Colors.primary + '80', // 50% opacity
  },
  outlineText: {
    color: Colors.primary,
  },
  outlineTextDisabled: {
    color: Colors.primary + '80', // 50% opacity
  },
  // Text button
  textButton: {
    backgroundColor: 'transparent',
  },
  textDisabled: {
    opacity: 0.5,
  },
  textButtonText: {
    color: Colors.primary,
  },
  textButtonTextDisabled: {
    color: Colors.primary + '80', // 50% opacity
  },
});