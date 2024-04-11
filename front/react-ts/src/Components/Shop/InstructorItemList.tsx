import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import "./ItemList.css";
import { Edit } from 'lucide-react';
import EightBitButton from '../Buttons/EightBitButton';
import { Item } from './Items';
import AddItem from './AddItem';

interface ItemListProps {
    items: Item[];
    courseId: string;
    role: string;
}

const InstructorItemList: React.FC<ItemListProps> = ({ items, courseId, role }) => {
    const navigate = useNavigate();
    const [createItem, setCreateItem] = React.useState<boolean>(false);

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
            courseId: courseId
          })
        });

        if (response.ok) {
          console.log("Item was updated.")
        }

      } catch (error) {
        console.error("Error updating item", error);
      }
    };

    const handleAddItem = () => {
      setCreateItem(true);
    }

    return (
        <div className="item-list-container">
          <div className="nes-container with-title is-centered">
            {createItem ? (<AddItem courseId={courseId}/>) : (<div>
              {/* <p className="title">{courseName}</p> */}
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
                        <td onClick={() => navigateToItemDescription(item)}>{item.itemName}</td>
                        <td>{item.itemPrice}</td>
                        <td>{<Edit onClick={() => handleEditItem(item._id)} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-start ml-6">
                {
                  role === 'instructor' ? (<button type='button' className='nes-btn is-primary' onClick={handleAddItem} >Add Item</button>) : null
                }
              </div>
            </div>)}
          </div>
        </div>
      );
    };
export default InstructorItemList