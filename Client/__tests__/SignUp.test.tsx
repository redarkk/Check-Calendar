
import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import SignUp from '../screens/SignUp'; 
import { ToastAndroid } from 'react-native/Libraries/Components/ToastAndroid/ToastAndroid';

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock ToastAndroid
const mockShow = jest.fn();
jest.mock(
  'react-native/Libraries/Components/ToastAndroid/ToastAndroid',
  () => ({
    show: mockShow,
    LONG: 5000, 
  }),
);

// Mock the axios post function
jest.mock('axios');

describe('SignUp Screen', () => {
  test('renders correctly', () => {
    const {getByPlaceholderText, getByText} = render(<SignUp />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Phone')).toBeTruthy();
    expect(getByPlaceholderText('name')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('SignUp')).toBeTruthy();
  });

  test('should sign up successfully and display success message', async () => {
    const {getByText, getByPlaceholderText} = render(<SignUp />);
    const emailInput = getByPlaceholderText('Email');
    const phoneInput = getByPlaceholderText('Phone');
    const nameInput = getByPlaceholderText('name');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('SignUp');

    fireEvent.changeText(emailInput, 'validemail@example.com');
    fireEvent.changeText(phoneInput, '1234567890');
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(passwordInput, 'strongPassword123');
    fireEvent.press(signUpButton);
  });

  test('handles invalid email format', async () => {
    const {getByPlaceholderText, getByText} = render(<SignUp />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Phone'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Test@1234');

    await act(async () => {
      fireEvent.press(getByText('SignUp'));
    });

    expect(getByText('wrong Email format')).toBeTruthy(); 
  });

  test('handles invalid phone length', async () => {
    const {getByPlaceholderText, getByText} = render(<SignUp />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Phone'), '1234'); // Invalid phone number length
    fireEvent.changeText(getByPlaceholderText('name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Test@1234');

    await act(async () => {
      fireEvent.press(getByText('SignUp'));
    });

    expect(getByText('Phone length should be equal to 10')).toBeTruthy(); 
  });

  
});
