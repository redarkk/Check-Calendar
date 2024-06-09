// Login.test.js

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import Login from '../screens/Login'; 
import { LoginSuccess } from '../store/authSlice';
// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock the axios post function
jest.mock('axios');

describe('Login Screen', () => {
  test('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Not a User?')).toBeTruthy();
    expect(getByText('SignUp')).toBeTruthy();
  });

  test('handles login successfully', async () => {
   

    const mockNavigate = jest.fn();
    
    
    const mockAxiosResponse = {
      status: 200,
      data: {
        msg: 'Login successfully',
      },
    };
    axios.post.mockResolvedValue(mockAxiosResponse);

    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Test@1234');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    expect(mockDispatch).toHaveBeenCalledWith(LoginSuccess({ email: 'test@example.com' }));
    expect(mockNavigate).toHaveBeenCalledWith('newBooking', { email: 'test@example.com' });
    expect(getByTestId('success-toast')).toBeTruthy(); 
  });

  test('handles login with invalid email', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Test@1234');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    expect(getByTestId('error-toast')).toBeTruthy(); 
  });

  test('handles login with invalid password', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'invalidpassword');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    expect(getByTestId('error-toast')).toBeTruthy(); // Assumes you have a toast with testID="error-toast" in your component
  });

  test('handles server error', async () => {
    const mockAxiosResponse = {
      status: 400,
      data: {
        msg: 'Server error',
      },
    };
    axios.post.mockResolvedValue(mockAxiosResponse);

    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Test@1234');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    expect(getByTestId('error-toast')).toBeTruthy(); 
  });
});
