import React, {useEffect, useState} from 'react';
import TransactionBadge from './TransactionBadge';
import { Item } from './Items';

interface ItemProps {
  item: Item;
  role: string;
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


const ItemCard: React.FC<ItemProps> = ({ item, role, handleItemDescription, handleItemRequest, handleItemBuy }) => {
    const [transaction, setTransaction] = useState<Transaction|null>(null);

    useEffect(() => {
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
            }
            } catch (error) {
            console.error('Error fetching tasks:', error);
            }
        };
        getTransction();
    }, []);

    

    const renderShopComponent = () => (
        <div 
            className="nes-container is-centered is-rounded is-dark item-card"
            onClick={() => handleItemDescription(item)}>
            
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
                transaction ? 
                <button className="nes-btn is-disabled buy-button">{transaction.status}</button>:
                <button className="nes-btn buy-button" onClick={(e)=>{
                    e.stopPropagation();
                    handleItemBuy(item);
                }}>Buy</button>
            }
            
        </div>
    );

    return (
        <>{renderShopComponent()}</>
    );
};
export default ItemCard;
