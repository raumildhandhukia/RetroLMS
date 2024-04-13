import React, { useState, useEffect } from 'react';
import { Item } from './Items';

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
    };

    return (
    <div>
        <h1>Request List</h1>
        <ol className="nes-list is-decimal">
        {transactions.map((transaction) => (
            <ul key={transaction?._id} className="nes-container with-title">
            <p className="title">{transaction?.username}</p>
            <div className="nes-btn-group" style={{ marginTop: '25px' }}>
                <button className="nes-btn is-success" style={{ marginRight: '25px' }} onClick={() => manageRequest("Approval", transaction._id)}>Accept</button>
                <button className="nes-btn is-error" style={{ marginRight: '25px' }} onClick={() => manageRequest("Reject", transaction._id)}>Reject</button>
                <button className="nes-btn is-warning" onClick={() => manageRequest("Awaiting", transaction._id)}>Reset</button>
            </div>
            </ul>
        ))}
        </ol>
        <button className="nes-btn" onClick={() => handleBack()}>Back</button>
    </div>
    );
};

export default RequestList;