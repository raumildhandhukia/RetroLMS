import React, { useState, useEffect } from 'react';
import { Item } from './Items';
import './RequestList.css';

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

const RequestList: React.FC<RequestListProps> = ({
    item,
    handleBack,
}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('Fetching Transactions...');
    const [stringOfExclamation, setStringOfExclamation] = useState('!');

    useEffect(() => {
        if (isLoading) {
            const t1 = setTimeout(() => {
                setLoaderMessage('Just a bit longer');
            }, 3000);

            const t2 = setTimeout(() => {
                setLoaderMessage('Almost done');
            }, 6000);

            const t3 = setInterval(() => {
                setStringOfExclamation((prev) => prev.length < 3 ? prev + '!' : '!');
            }, 500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearInterval(t3);
            };
        }
    }, [isLoading]);

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
                throw new Error('Failed to fetch transactions');
            }
            const transactions = await response.json();
            setTransactions(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const manageRequest = async (status: string, transactionId: string) => {
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
            getTransactions();
        } catch (error) {
            console.error('Error managing request:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
  <div className='nes-container with-title request-container is-dark' style={{ width: '63vw', minHeight:'80vh' }}>
    <p className="title">Request List</p>
    <ol className="nes-list is-decimal">
      {transactions.map((transaction) => (
        <ul key={transaction?._id} className="nes-container with-title is-rounded is-dark" style={{width:"100vh"}}>
          <p className="title">{transaction?.username}</p>
          <div className="nes-btn-group" style={{ marginTop: '25px', marginBottom:'10px' }}>
            {transaction?.status === 'Awaiting' ? (
              <div>
                <button className="nes-btn is-success" style={{ marginRight: '25px' }} onClick={() => manageRequest("Approval", transaction._id)}>Accept</button>
                <button className="nes-btn is-error" style={{ marginRight: '25px' }} onClick={() => manageRequest("Reject", transaction._id)}>Reject</button>
              </div>
            ) : (
              <button className="nes-btn is-warning" onClick={() => manageRequest("Awaiting", transaction._id)}>Reset</button>
            )}
          </div>
        </ul>
      ))}
      
    </ol>
    <button className="nes-btn back-button" onClick={() => handleBack()}>Back</button>
  </div>
);

};

export default RequestList;