import React, {useEffect, useState} from 'react';
import TransactionBadge from './TransactionBadge';
import Loader from '../Loader';
import { Item } from './Items';

interface ItemProps {
  item: Item;
  role: string;
  studentBalance: number;
  handleItemDescription: Function;
  handleItemRequest: Function;
  handleItemBuy: Function;
}

interface Transaction {
    _id: string;
    itemId: string;
    studentId: string;
    price: number;
    status: string;
}


const ItemCard: React.FC<ItemProps> = ({ item, role, handleItemDescription, handleItemRequest, handleItemBuy, studentBalance }) => {
    const [transaction, setTransaction] = useState<Transaction|null>(null);
    const [transactionState, setTransactionState] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [update, setUpdate] = useState<boolean>(false);

    const getTransction = async () => {
                try {
                const response = await fetch(`http://localhost:8080/getTrasactionsByItemByStudent/${item?._id}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                } else {
                    const transaction: Transaction = await response.json();
                    setTransaction(transaction);
                    setTransactionState(transaction.status);
                }
                } catch (error) {
                console.error('Error fetching tasks:', error);
                } finally {
                    setLoading(false);
                }
            };

    useEffect(() => {
        
        if (role === 'student') {
            getTransction();
        } else {
            setLoading(false);
        }
        
    }, []);

    

    const renderShopComponent = () => (
        <div 
            className="nes-container is-centered is-rounded is-dark item-card"
            onClick={() => handleItemDescription(item)}>
            { loading ? <Loader /> :
            <>
            <div className="item-content">
                <span>{item.itemName}</span>
                <p>{item.itemDescription}</p>
                <span>${item.itemPrice}</span>
            </div>
            {
                role === "instructor" ? (
                    <button className="nes-btn buy-button" onClick={(e)=>{
                        e.stopPropagation();
                        handleItemRequest(item);
                    }}>Requests</button>
                ) : 
                transactionState ? 
                <button className="nes-btn is-disabled buy-button">{transactionState}</button>:
                <button className={`nes-btn buy-button` + (studentBalance < item.itemPrice ? ' is-disabled' : '')}
                onClick={(e)=>{
                    e.stopPropagation();
                    setTransactionState('Awaiting');
                    handleItemBuy(item);
                }}>Buy</button>
            }
        </>}
        </div>
    );

    return (
        <>{renderShopComponent()}</>
    );
};
export default ItemCard;
