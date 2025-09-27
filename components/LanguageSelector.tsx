import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react-native';
import { useLanguageStore } from '@/store/language-store';
import Colors from '@/constants/colors';
import { languages } from '@/constants/languages';

type LanguageSelectorProps = {
  variant?: 'button' | 'minimal' | 'dropdown' | 'icon';
  size?: 'small' | 'medium' | 'large';
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'dropdown',
  size = 'medium'
}) => {
  const { i18n } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    setDropdownVisible(false);
  };
  
  if (variant === 'minimal') {
    return (
      <TouchableOpacity 
        style={styles.minimalButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Globe size={20} color="#FFFFFF" />
        <Text style={styles.minimalLanguageText}>{currentLanguage.code.toUpperCase()}</Text>
        
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.languageItem}
                    onPress={() => handleLanguageChange(item.code)}
                  >
                    <View style={styles.languageItemContent}>
                      <Text style={styles.languageFlag}>{item.flag}</Text>
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageName}>{item.name}</Text>
                        <Text style={styles.languageNativeName}>{item.nativeName}</Text>
                      </View>
                    </View>
                    
                    {currentLanguage.code === item.code && (
                      <Check size={18} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    );
  }
  
  if (variant === 'button') {
    return (
      <TouchableOpacity 
        style={styles.buttonContainer}
        onPress={() => setDropdownVisible(true)}
      >
        <Globe size={16} color={Colors.primary} />
        <Text style={styles.buttonText}>
          {currentLanguage.name}
        </Text>
        <ChevronDown size={16} color={Colors.primary} />
        
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.languageItem}
                    onPress={() => handleLanguageChange(item.code)}
                  >
                    <View style={styles.languageItemContent}>
                      <Text style={styles.languageFlag}>{item.flag}</Text>
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageName}>{item.name}</Text>
                        <Text style={styles.languageNativeName}>{item.nativeName}</Text>
                      </View>
                    </View>
                    
                    {currentLanguage.code === item.code && (
                      <Check size={18} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    );
  }
  
  if (variant === 'icon') {
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    
    return (
      <TouchableOpacity 
        style={[
          styles.iconButton,
          size === 'small' ? styles.iconButtonSmall : 
          size === 'large' ? styles.iconButtonLarge : 
          styles.iconButtonMedium
        ]}
        onPress={() => setDropdownVisible(true)}
      >
        <Globe size={iconSize} color="#FFFFFF" />
        
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.languageItem}
                    onPress={() => handleLanguageChange(item.code)}
                  >
                    <View style={styles.languageItemContent}>
                      <Text style={styles.languageFlag}>{item.flag}</Text>
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageName}>{item.name}</Text>
                        <Text style={styles.languageNativeName}>{item.nativeName}</Text>
                      </View>
                    </View>
                    
                    {currentLanguage.code === item.code && (
                      <Check size={18} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    );
  }
  
  // Default dropdown style
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dropdownHeader}
        onPress={() => setDropdownVisible(true)}
      >
        <View style={styles.headerContent}>
          <Globe size={16} color={Colors.text.secondary} />
          <Text style={styles.label}>Language</Text>
        </View>
        <View style={styles.selectedLanguageContainer}>
          <Text style={styles.selectedLanguageText}>
            {currentLanguage.name}
          </Text>
          <ChevronDown size={16} color={Colors.text.secondary} />
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleLanguageChange(item.code)}
                >
                  <View style={styles.languageItemContent}>
                    <Text style={styles.languageFlag}>{item.flag}</Text>
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageName}>{item.name}</Text>
                      <Text style={styles.languageNativeName}>{item.nativeName}</Text>
                    </View>
                  </View>
                  
                  {currentLanguage.code === item.code && (
                    <Check size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  dropdownHeader: {
    flexDirection: 'column',
    gap: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  selectedLanguageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLanguageText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 6,
    marginRight: 4,
  },
  minimalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  minimalLanguageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  iconButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconButtonMedium: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconButtonLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: '90%',
    maxWidth: 340,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageInfo: {
    flexDirection: 'column',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  languageNativeName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  }
});

export default LanguageSelector;