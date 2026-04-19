import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading = false }) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primaryBg,
        isSecondary && styles.secondaryBg,
        isOutline && styles.outlineBg,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : '#007AFF'} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && styles.primaryText,
            isSecondary && styles.secondaryText,
            isOutline && styles.outlineText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minWidth: 200,
  },
  primaryBg: {
    backgroundColor: '#007AFF', // iOS blue
  },
  secondaryBg: {
    backgroundColor: '#E5E5EA',
  },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#000000',
  },
  outlineText: {
    color: '#007AFF',
  },
});
