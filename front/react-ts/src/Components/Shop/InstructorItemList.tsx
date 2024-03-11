import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import "./ItemList.css";
import { Edit } from 'lucide-react';

interface Item{
    _id: string;
    title: string;
    description: string;
    price: number;
    courseName: string;

}
interface ItemListProps {
    items: Item[];
    courseName: string;
}

const InstructorItemList: React.FC<ItemListProps> = ({ items, courseName }) => {
    const navigate = useNavigate();

    const navigateToItemDescription = (item: Item) => {
        navigate('/item', {state: {item}});
    };

    const handleEditItem = async (itemId: string) => {
      try {
        const response = await fetch("http://localhost:8080/item/updateItem?itemId=123", {
          method: "POST",
          body: JSON.stringify({
            _id: itemId,
            title: "New Item",
            description: "This is the updated item",
            price: 300,
            courseName: "SER 517"
          })
        });

        if (response.ok) {
          console.log("Item was updated.")
        }

      } catch (error) {
        console.error("Error checking authentication:", error);
      }
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
                    <th className="price">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="item-item">
                      {/* Use onClick to call navigateToTaskDescription on click */}
                      <td onClick={() => navigateToItemDescription(item)}>{item.title}</td>
                      <td>{item.price}</td>
                      <td>{<Edit onClick={() => handleEditItem(item._id)} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };
export default InstructorItemList