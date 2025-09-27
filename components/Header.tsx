import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showLanguageSelector?: boolean;
  showLogo?: boolean;
  rightComponent?: React.ReactNode;
}

export default function Header({ 
  title, 
  showBackButton = true,
  showLanguageSelector = false,
  showLogo = false,
  rightComponent 
}: HeaderProps) {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
        {showLogo && (
          <Logo size="small" color={Colors.primary} useImage={true} />
        )}
      </View>
      
      {!showLogo && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.rightContainer}>
        {showLanguageSelector ? (
          <LanguageSelector variant="button" size="small" />
        ) : (
          rightComponent
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
});