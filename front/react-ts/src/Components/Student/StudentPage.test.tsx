import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentPage from './StudentPage';

const sampleStudent = {
  id: 1,
  name: 'Vamsi',
  email: 'vamsi.kolapalli@gmail.com',
  currencyBalance: 10,
  submittedTasks: ['Task 1', 'Task 2', 'Task 3'],
  earnedCurrency: { 'Task 1': 20, 'Task 2': 30, 'Task 3': 10 },
};


const shopItems = [
  { name: 'Item 1', price: 20 }
];
jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('StudentPage', () => {
  it('renders student information correctly', () => {
    render(<StudentPage />);
    expect(screen.getByText(`Name: ${sampleStudent.name}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${sampleStudent.email}`)).toBeInTheDocument();
    expect(screen.getByText(`Currency Balance: ${sampleStudent.currencyBalance}$`)).toBeInTheDocument();
  });

  it('displays submitted tasks correctly', () => {
    render(<StudentPage />);
    expect(screen.getByText('Submitted Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('displays leaderboard correctly', () => {
    render(<StudentPage />);
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Vamsi')).toBeInTheDocument();
    expect(screen.getByText('60$')).toBeInTheDocument(); 
  });

  it('displays shop items correctly', () => {
    render(<StudentPage />);
    expect(screen.getByText('Shop Items')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles item purchase correctly', () => {
    render(<StudentPage />);
    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[2]);
    expect(window.alert).toHaveBeenCalledWith('Bought Item 3 for 5 currency');
   
  });

  it('handles item purchase incorrectly', () => {
    render(<StudentPage />);
    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[0]);
    expect(window.alert).toHaveBeenCalledWith('Insufficient funds');
   
  });
});
