import React, { useState } from 'react';
import './StudentPage.css';

interface Student {
  id: number;
  name: string;
  email: string;
  currencyBalance: number;
  submittedTasks: string[];
  earnedCurrency: Record<string, number>;
}

const sampleStudent: Student = {
  id: 1,
  name: 'Vamsi',
  email: 'vamsi.kolapalli@gmail.com',
  currencyBalance: 150,
  submittedTasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6'],
  earnedCurrency: { 'Task 1': 20, 'Task 2': 30, 'Task 3': 10, 'Task 4': 20, 'Task 5': 30, 'Task 6': 10, 'Task 7': 20, 'Task 8': 30, 'Task 9': 10 },
};

const sampleStudents: Student[] = [
    {
      id: 1,
      name: 'Vamsi',
      email: 'vamsi.kolapalli@gmail.com',
      currencyBalance: 150,
      submittedTasks: ['Task 1', 'Task 2', 'Task 3'],
      earnedCurrency: { 'Task 1': 20, 'Task 2': 30, 'Task 3': 10 },
    },
    {
      id: 2,
      name: 'Rohith',
      email: 'rohith@gmail.com',
      currencyBalance: 200,
      submittedTasks: ['Task 1', 'Task 3'],
      earnedCurrency: { 'Task 1': 25, 'Task 3': 15 },
    },
    {
      id: 2,
      name: 'Raumil',
      email: 'raumil@gmail.com',
      currencyBalance: 200,
      submittedTasks: ['Task 1', 'Task 3'],
      earnedCurrency: { 'Task 1': 25, 'Task 3': 15 },
    },{
      id: 2,
      name: 'Dhairya',
      email: 'dhairya@gmail.com',
      currencyBalance: 200,
      submittedTasks: ['Task 1', 'Task 3'],
      earnedCurrency: { 'Task 1': 25, 'Task 3': 15 },
    },{
      id: 2,
      name: 'Siri',
      email: 'siri@gmail.com',
      currencyBalance: 200,
      submittedTasks: ['Task 1', 'Task 3'],
      earnedCurrency: { 'Task 1': 25, 'Task 3': 15 },
    },
    
  ];
  const shopItems = [
    { name: 'Item 1', price: 20 },
    { name: 'Item 2', price: 30 },
    { name: 'Item 3', price: 15 }
  ];

const StudentPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleBuyItem = (itemName: string, itemPrice: number) => {
    const currentBalance = sampleStudent.currencyBalance;
    
    if (currentBalance >= itemPrice) {
      alert(`Bought ${itemName} for ${itemPrice} currency`);
      sampleStudent.currencyBalance -= itemPrice;
    } else {
      console.log('coming here')
      alert(`Insufficient funds`);
    }
  };
  const courses = ['Course 1', 'Course 2', 'Course 3']; 

  const sortedStudents = [...sampleStudents].sort((a, b) => {
    const earnedCurrencyA = Object.values(a.earnedCurrency).reduce((total, value) => total + value, 0);
    const earnedCurrencyB = Object.values(b.earnedCurrency).reduce((total, value) => total + value, 0);
    return earnedCurrencyB - earnedCurrencyA;
  });

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

return (
    <div className="StudentPage">
      <div className="FirstHeader">
      <div className="NameSection">
        <h3>Name: {sampleStudent.name}</h3>
        <h3>Email: {sampleStudent.email}</h3>
      </div>
      <div className="CurrencySection">
        <h3>Currency Balance: {sampleStudent.currencyBalance}$</h3>
      </div>
      </div>
      <div className="SubmittedTasksSection" >
        <h3>Submitted Tasks</h3>
        <div className='scroll'>
          <table>
            <thead className="sticky-head">
              <tr>
                <th>Task Completed</th>
                <th>Earned Currency for each Task</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sampleStudent.earnedCurrency).map(([task, earned], index) => (
                <tr key={index}>
                  <td>{task}</td>
                  <td>{earned}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="LeaderboardSection">
        <h3>Leaderboard</h3>
        <div className='scroll'>
          <table>
            <thead className="sticky-head">
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                <th>Earned Currency</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{Object.values(student.earnedCurrency).reduce((total, value) => total + value, 0)}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ShopItemsSection">
        <h3>Shop Items</h3>
        <div className='scroll'>
          <table>
            <thead className="sticky-head">
              <tr>
                <th>Item Name</th>
                <th>Item Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shopItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}$</td>
                  <td>
                    <button
                      onClick={() => handleBuyItem(item.name, item.price)} >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
