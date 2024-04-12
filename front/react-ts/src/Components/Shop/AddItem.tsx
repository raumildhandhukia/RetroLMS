
import React, { useState, ChangeEvent } from 'react';
import 'nes.css/css/nes.min.css';
import EightBitButton from '../Buttons/EightBitButton';

interface AddItemProps {
  courseId: string;
  update: Function;
  handleBack: Function;
}

const AddItem: React.FC<AddItemProps> = ({courseId, update, handleBack}) => {

  const [itemName, setItemName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemExpiry, setItemExpiry] = useState<number>(0);

  const handleAddItem = async () => {
    try {
      const response = await fetch("http://localhost:8080/createItem", {
        method: "POST",
        headers: {
                    'Content-Type': 'application/json'
                },
        credentials: 'include',
        body: JSON.stringify({
          itemName,
          itemDescription,
          itemPrice,
          itemExpiry,
          courseId,
        })
      });

      if (response.ok) {
        update();
        handleBack();
      }

    } catch (error) {
      console.error("Error creating item.", error);
    }
  }

  return (
    <div className="item-description-container mt-28">
      <div className="nes-container with-title is-centered">
        <p className="title">Add Item</p>
        <div className="field-container">
              <div className="nes-field">
                <label htmlFor='name'>Name</label>
                <input
                  type='text'
                  id='name'
                  className="nes-input"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="nes-field">
                <label htmlFor='price'>Price</label>
                <input
                  type='text'
                  id='price'
                  className="nes-input"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                />
              </div>
              <div className="nes-field">
                <label htmlFor='expiry'>Expiry</label>
                <input
                  type='text'
                  id='expiry'
                  className="nes-input"
                  value={itemExpiry}
                  onChange={(e) => setItemExpiry(Number(e.target.value))}
                />
              </div>
        </div>
        <div className="nes-field">
                <label htmlFor='description'>Description</label>
                <input
                  type='text'
                  id='description'
                  className="nes-input"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </div>
        <div className='flex items-start my-10'>
          <button type="button" className='nes-btn is-primary' onClick={()=>{
            handleBack();
          }}>Back</button>
          <button type="button" className='nes-btn is-primary' onClick={handleAddItem}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
