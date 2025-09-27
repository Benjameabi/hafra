import React from "react";
import { Tabs } from "expo-router";
import { Home, User, Calendar, MessageSquare, Newspaper } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";

export default function TabLayout() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarStyle: {
          borderTopColor: Colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="about"
        options={{
          title: t('common.about'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="work-with-me"
        options={{
          title: t('common.services'),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="podcast"
        options={{
          title: t('common.podcast'),
          tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="contact"
        options={{
          title: t('common.contact'),
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      
      {isAdmin && (
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            title: t('admin.dashboard'),
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}