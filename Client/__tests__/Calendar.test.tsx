import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import CalendarView from '../screens/calenderView';

// Mock the axios delete function
jest.mock('axios');

describe('CalendarView Screen', () => {
  test('renders correctly', () => {
  });

  test('handles booking deletion successfully', async () => {

    // Mock the axios delete function for successful deletion
    axios.delete.mockResolvedValueOnce({
      status: 200,
      data: {
        message: 'Booking deleted successfully',
      },
    });

    const { getByText, queryByText } = render(<CalendarView />);

    // Wait for the async tasks to finish
    await waitFor(() => getByText('Book Now'));

    // Trigger the booking deletion
    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);

    // Wait for the async tasks to finish
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));

    // Check if the success toast message is displayed
    expect(queryByText('Booking deleted successfully')).toBeTruthy();
  });

  test('handles booking deletion error', async () => {
    // ... previous setup ...

    // Mock the axios delete function for failed deletion
    axios.delete.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: 'Booking deletion failed',
        },
      },
    });

   

    // Wait for the async tasks to finish
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));

    // Check if the error message is displayed
    expect(queryByText('Booking deletion failed')).toBeTruthy();
  });

  
});
