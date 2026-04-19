import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { AppProvider, useAppContext } from '../src/store/AppContext';

function Harness() {
  const context = useAppContext();

  return (
    <>
      <Text testID="field-count">{String(context.extractedFields.length)}</Text>
      <Text testID="first-key">{context.extractedFields[0]?.key ?? ''}</Text>
      <Text testID="first-value">{context.extractedFields[0]?.value ?? ''}</Text>
      <Text testID="job-status">{context.jobStatus ?? ''}</Text>
      <Text testID="progress">{String(context.progress)}</Text>
      <Text testID="error">{context.processingError ?? ''}</Text>
      <Text testID="add-field" onPress={() => context.addField()}>
        add
      </Text>
      <Text testID="update-field" onPress={() => context.updateField(0, 'Invoice', '123')}>
        update
      </Text>
      <Text testID="remove-field" onPress={() => context.removeField(0)}>
        remove
      </Text>
      <Text testID="set-job" onPress={() => context.setJobStatus('ocr_running')}>
        set-job
      </Text>
      <Text testID="set-progress" onPress={() => context.setProgress(55)}>
        set-progress
      </Text>
      <Text testID="set-error" onPress={() => context.setProcessingError('boom')}>
        set-error
      </Text>
    </>
  );
}

describe('AppContext', () => {
  it('adds, updates, and removes structured fields', () => {
    const screen = render(
      <AppProvider>
        <Harness />
      </AppProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByTestId('add-field'));
    });
    expect(screen.getByTestId('field-count')).toHaveTextContent('1');

    act(() => {
      fireEvent.press(screen.getByTestId('update-field'));
    });
    expect(screen.getByTestId('first-key')).toHaveTextContent('Invoice');
    expect(screen.getByTestId('first-value')).toHaveTextContent('123');

    act(() => {
      fireEvent.press(screen.getByTestId('remove-field'));
    });
    expect(screen.getByTestId('field-count')).toHaveTextContent('0');
  });

  it('stores job lifecycle values', () => {
    const screen = render(
      <AppProvider>
        <Harness />
      </AppProvider>,
    );

    act(() => {
      fireEvent.press(screen.getByTestId('set-job'));
      fireEvent.press(screen.getByTestId('set-progress'));
      fireEvent.press(screen.getByTestId('set-error'));
    });

    expect(screen.getByTestId('job-status')).toHaveTextContent('ocr_running');
    expect(screen.getByTestId('progress')).toHaveTextContent('55');
    expect(screen.getByTestId('error')).toHaveTextContent('boom');
  });

  it('throws when hook is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Harness />)).toThrow('useAppContext must be used within an AppProvider');

    spy.mockRestore();
  });
});
