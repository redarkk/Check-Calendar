// NewBooking.test.js

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import NewBooking from '../screens/NewBooking'; 

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the axios post function
jest.mock('axios');

describe('NewBooking Screen', () => {
  test('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<NewBooking />);

    expect(getByPlaceholderText('Technician Name')).toBeTruthy();
    expect(getByPlaceholderText('Product')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Book Appointment')).toBeTruthy();
  });

  test('handles booking successfully', async () => {
    

    // Mock the axios post function
    const mockAxiosResponse = {
      status: 200,
      data: {
        message: 'Booking successfully',
      },
    };
    jest.spyOn(axios, 'post').mockResolvedValue(mockAxiosResponse);

    const { getByPlaceholderText, getByText, getByTestId } = render(<NewBooking />);

    // Fill the input fields
    fireEvent.changeText(getByPlaceholderText('Technician Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Product'), 'Product Name');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Test description');

    // Set up dates and times
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 86400000); // One day in the future
    fireEvent.press(getByText('Select Day'));
    await act(async () => {
      fireEvent(getByTestId('datePicker'), 'change', { nativeEvent: { timestamp: futureDate.getTime() } });
    });

    fireEvent.press(getByText('Select Start Time'));
    await act(async () => {
      fireEvent(getByTestId('datePicker'), 'change', { nativeEvent: { timestamp: currentDate.getTime() } });
    });

    fireEvent.press(getByText('Select End Time'));
    await act(async () => {
      fireEvent(getByTestId('datePicker'), 'change', { nativeEvent: { timestamp: futureDate.getTime() } });
    });

    // Trigger the booking button press
    fireEvent.press(getByText('Book Appointment'));

    // Wait for the async tasks to finish
    await Promise.resolve();

    // Test if the navigation was called after successful booking
    // expect(mockNavigate).toHaveBeenCalledWith('Calendar', { email: 'test@example.com' });

    // Test if the toast message is displayed after successful booking
    expect(getByTestId('success-toast')).toBeTruthy();
  });

});
