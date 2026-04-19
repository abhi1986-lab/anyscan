import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '../src/components/Button';

describe('Button', () => {
  it('renders title and calls onPress', () => {
    const onPress = jest.fn();
    const screen = render(<Button title="Upload" onPress={onPress} />);

    fireEvent.press(screen.getByText('Upload'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disables presses while loading', () => {
    const onPress = jest.fn();
    const screen = render(<Button title="Upload" onPress={onPress} loading />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders outline variant text', () => {
    const screen = render(<Button title="Share" onPress={jest.fn()} variant="outline" />);

    expect(screen.getByText('Share')).toBeTruthy();
  });
});
