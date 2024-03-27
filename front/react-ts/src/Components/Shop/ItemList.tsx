import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import "./ItemList.css";
import { Item } from './Items';

interface ItemListProps {
    items: Item[];
    courseName: string;
}

const ItemList: React.FC<ItemListProps> = ({ items, courseName }) => {
    const navigate = useNavigate();

    const navigateToItemDescription = (item: Item) => {
        navigate('/item', {state: {item}});
    };

    return (
        <div className="item-list-container">
          <div className="nes-container with-title is-centered">
            <p className="title">{courseName}</p>
            <div className="item-list-content">
              <h2>Items List</h2>
              <table className="nes-table is-bordered is-centered">
                <thead>
                  <tr>
                    <th className="item-title">Item Title</th>
                    <th className="price">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="item-item">
                      {/* Use onClick to call navigateToTaskDescription on click */}
                      <td onClick={() => navigateToItemDescription(item)}>{item.itemName}</td>
                      <td>{item.itemPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };
export default ItemList