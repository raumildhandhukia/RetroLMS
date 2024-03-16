import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import "./ItemList.css";
import { Edit } from 'lucide-react';

interface Item {
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
            itemName: "New Item",
            itemDescription: "This is the updated item",
            itemPrice: 300,
            courseId: "SER 517"
          })
        });

        if (response.ok) {
          console.log("Item was updated.")
        }

      } catch (error) {
        console.error("Error updating item", error);
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
            <div className="flex items-start ml-6">
              <EightBitButton 
                classNames="bg-[#A52A2A] my-5"
                onClick={() => {
                  navigate('/items/add')
                }}
              >
                <p className="m-0 text-white">Add Item</p>
              </EightBitButton>
            </div>
          </div>
        </div>
      );
    };
export default InstructorItemList