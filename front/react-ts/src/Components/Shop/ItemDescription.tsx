
import React, {useState} from 'react';
import 'nes.css/css/nes.min.css';
import './ItemDescription.css'; // Import custom styles
import { Item } from './Items'; // Import the Item interface
import DeletePrompt from './DeletePrompt';

interface ItemDescriptionProps {
    selectedItem: Item|null;
    update: Function;
    handleBack: Function;
    role: string;
}
const ItemDescription: React.FC<ItemDescriptionProps> = ({selectedItem:item, update, handleBack, role}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleating, setIsDeleating] = useState(false);
  const [title, setTitle] = useState(item?.itemName);
  const [description, setdescription] = useState(item?.itemDescription);
  const [expiry, setExpiry] = useState(item?.itemExpiry);
  const [price, setPrice] = useState(item?.itemPrice+"");
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditMode = () => {
    setIsEditing(true);
    handleUpdateTask();
  }

  const handleDeleteMode = () => {
    setIsDeleating(true);
  } 

  const handleUpdateTask = async () => {
    if (isEditing) {
      if (!title || !description || !expiry || !price) {
        setErrorMessage('All fields are required.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/items/${item?._id}`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName:title,
            itemDescription: description,
            itemPrice: price,
            itemExpiry: expiry,
          })
        });

        if (response.ok) {
          console.log("Item was updated.")
          update();
          setIsEditing(false);
        }

      } catch (error) {
        console.error("Error updating item", error);
      }
    }
  };

  const handleBuyRequest = async () => {
    try {
      const response = await fetch("http://localhost:8080/requestItem", {
        method: "POST",
        headers: {
                    'Content-Type': 'application/json'
                },
        credentials: 'include',
        body: JSON.stringify({
          itemId: item?._id,
          price: item?.itemPrice
        })
      });
    } catch (error) {
      console.error("Error buying item.", error);
    } 
  };
      
        
  
  return (
        <div className="task-description-container">
            <div className="nes-container with-title is-centered">
                <p className="title">{title}</p>
                {!isDeleating ? (<div>
                    <div className="field-container">
                        <div className="nes-field">
                            <label htmlFor="title_field">Title:</label>
                            {!isEditing ?
                            <p onDoubleClick={handleEditMode}>{title}</p>
                            :
                            <input
                                type="text"
                                id="title_field"
                                className="nes-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            }
                        </div>
                        <div className="nes-field">
                            <label htmlFor="deadline_field">Expiry:</label>
                            {!isEditing ?
                            <p onDoubleClick={handleEditMode}>{expiry}</p>
                            :
                            <input
                                type="text"
                                id="deadline_field"
                                className="nes-input"
                                value={expiry}
                                onChange={(e) => setExpiry(Number(e.target.value))}
                            />
                            }
                        </div>
                        <div className="nes-field">
                            <label htmlFor="points_field">Points:</label>
                            {!isEditing ?
                            <p onDoubleClick={handleEditMode}>{price}</p>
                            :
                            <input
                                type="number"
                                id="points_field"
                                className="nes-input"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />}
                        </div>
                    </div>
                    <div className="nes-field description-field">
                        <label htmlFor="description_field">Description:</label>
                        {!isEditing ?
                        <p onDoubleClick={handleEditMode}>{description}</p>
                        :
                        <textarea
                            id="description_field"
                            className="nes-textarea"
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            rows={5}
                        />}
                    </div>

                    {/* Error Message */}
                    {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
                    {/* Add Task Button */}
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                        <button type="button" className='nes-btn is-error' onClick={() => {
                            handleBack();
                        }}>
                            Back
                        </button>
                         {role === 'instructor' ? (<>
                            
                            <button type="button" className={'nes-btn is-primary'}
                                    onClick={handleEditMode}>
                                Edit
                            </button>

                            <button type='button' className='nes-btn is-primary' onClick={handleDeleteMode} >Delete</button>

                        </>) : <button type="button" className='nes-btn is-primary' onClick={handleBuyRequest} >Buy</button>}
                        
                    </div>
                </div>) : <DeletePrompt item={item} redirectToItemList={handleBack} update={update}/>}
                
            </div>
        </div>
    );
  };


export default ItemDescription;
