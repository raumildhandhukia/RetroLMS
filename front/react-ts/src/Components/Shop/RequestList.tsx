import React, { useState, useEffect } from 'react';
import { Item } from './Items';
import './RequestList.css';
import io from 'socket.io-client';

interface RequestListProps {
    item: Item | null;
    handleBack: Function;
}
interface Transaction {
    _id: string;
    itemId: string;
    studentId: string;
    price: number;
    status: string;
    username: string;
}

const getButtonStyles = (status: string, buttonName: string) => {
        if (status === 'Approval' && buttonName === 'Accept') {
            return 'nes-btn is-disabled';
        } else if (status === 'Reject' && buttonName === 'Reject') {
            return 'nes-btn is-disabled';
        } else if (status === 'Awaiting' && buttonName === 'Reset') {
            return 'nes-btn is-disabled';
        } else if (status === 'Approval' && buttonName === 'Reject') {
            return 'nes-btn is-disabled';
        } else if (status === 'Reject' && buttonName === 'Accept') {
            return 'nes-btn is-disabled';
        } else if (status === 'Awaiting' && buttonName === 'Accept') {
            return 'nes-btn is-success';
        } else if (status === 'Awaiting' && buttonName === 'Reject') {
            return 'nes-btn is-error';
        } else if (status === 'Approval' && buttonName === 'Reset') {
            return 'nes-btn is-warning';
        } else if (status === 'Reject' && buttonName === 'Reset') {
            return 'nes-btn is-warning';
        } else {
            return 'nes-btn';
        }
    }

const doTransaction = (current:string, next:string) => {
            if (current === 'Approval' && next === 'Accept') {
                return false;
            } else if (current === 'Reject' && next === 'Reject') {
                return false;
            } else if (current === 'Awaiting' && next === 'Reset') {
                return false;
            } else if (current === 'Approval' && next === 'Reject') {
                return false;
            } else if (current === 'Reject' && next === 'Accept') {
                return false;
            } else if (current === 'Awaiting' && next === 'Accept') {
                return true;
            } else if (current === 'Awaiting' && next === 'Reject') {
                return true;
            } else if (current === 'Approval' && next === 'Reset') {
                return true;
            } else if (current === 'Reject' && next === 'Reset') {
                return true;
            } else {
                return false;
            }
        }

const RequestList: React.FC<RequestListProps> = ({
    item,
    handleBack,
}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        getTransactions();
    });

    const getTransactions = async () => {
        try {
            const response = await fetch(`http://localhost:8080/getTransactionsByItem/${item?._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                
            }
            const transactions = await response.json();
            setTransactions(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const sendNotification = (status: string, studentId: string) => {
        const socket = io("http://localhost:8080", { transports: ["websocket"] });
        socket.emit(
          'manageRequest', 
          { message: `Your purchase for ${item?.itemName} is ${status === 'Approval' ? 'Approved' : status === 'Awaiting' ? 'Awaiting' : 'Rejected'}`,
          studentId: studentId });
    }

    const manageRequest = async (status: string, transactionId: string, studentId:string) => {
        try {
            const response = await fetch(`http://localhost:8080/updateTransaction/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to manage request');
            } 
            const appliedStatus = (await response.json()).status;
            sendNotification(appliedStatus, studentId);
            getTransactions();
        } catch (error) {
            console.error('Error managing request:', error);
        }
    };

    

return (
  <div className='nes-container with-title request-container is-dark' style={{ width: '63vw', minHeight:'80vh' }}>
    <p className="title">Request List</p>
    <ol className="nes-list is-decimal">
      {transactions.map((transaction) => (
        <ul key={transaction?._id} className="nes-container with-title is-rounded is-dark" style={{width:"100vh"}}>
          <p className="title">{transaction?.username}</p>
          {transaction.status === 'Approval' ? <p style={{color:'lime'}}>Approved</p> : transaction.status === 'Awaiting' ? <p style={{color:'cyan'}}>Awaiting</p> : <p style={{color:'red'}}>Rejected</p>}
          <div className="nes-btn-group" style={{ marginTop: '25px', marginBottom:'10px' }}>
              <div>
                <button className={getButtonStyles(transaction.status, "Accept")} style={{ marginRight: '25px' }} 
                onClick={() => {
                  if (!doTransaction(transaction.status, "Accept")){return;}
                  manageRequest("Approval", transaction._id, transaction.studentId)
                  }}>Accept</button>
                <button className={getButtonStyles(transaction.status, "Reject")} style={{ marginRight: '25px' }} 
                onClick={() => {
                  if (!doTransaction(transaction.status, "Reject")){return;}
                  manageRequest("Reject", transaction._id, transaction.studentId)
                  }}>Reject</button>
                <button className={getButtonStyles(transaction.status, "Awaiting")} 
                onClick={() => {
                  if (!doTransaction(transaction.status, "Reset")){return;}
                  manageRequest("Awaiting", transaction._id, transaction.studentId)
                }}>Reset</button>
              </div>
            
          </div>
        </ul>
      ))}
      
    </ol>
    <button className="nes-btn back-button" onClick={() => handleBack()}>Back</button>
  </div>
);

};

export default RequestList;