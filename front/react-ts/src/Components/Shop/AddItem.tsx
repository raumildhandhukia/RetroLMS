
import React, { useState, ChangeEvent } from 'react';
import 'nes.css/css/nes.min.css';
import EightBitButton from '../Buttons/EightBitButton';

interface CreateItemRequest {
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  itemExpiry: number;
  courseId: string;
}

const AddItem: React.FC<{}> = () => {
  const [request, setRequest] = useState<CreateItemRequest>({
    itemName: "",
    itemDescription: "",
    itemPrice: 0,
    itemExpiry: 0,
    courseId: "65ee276576ac94ef4a77bdba"
  })

  const inputFields: {
    id: keyof CreateItemRequest
    name: string
    type: string
  }[] = [
    {id: "itemName", name: "Item Name" , type: "string"},
    {id: "itemPrice", name: "Item Price" , type: "number"},
    {id: "itemExpiry", name: "Item Expiry" , type: "number"},
    // {id: "courseId", name: "Course ID", type: "string" }
  ]

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    let { id, value } = event.target
    let valueToUpdate
    id === "itemPrice" || id === "itemExpiry" ?
    valueToUpdate = parseInt(value) :
    valueToUpdate = value
    
    setRequest({
      ...request,
      [id]: valueToUpdate
    })
  }

  console.log(request)

  const handleAddItem = async () => {
    try {
      const {
        itemName,
        itemDescription,
        itemPrice,
        itemExpiry,
        courseId,
      } = request
      const response = await fetch("http://localhost:8080/createItem", {
        method: "POST",
        body: JSON.stringify({
          itemName,
          itemDescription,
          itemPrice,
          itemExpiry,
          courseId,
        }),
        credentials: 'include'
      });

      if (response.ok) {
        alert(`Item with ${itemName}, with price ${itemPrice} was added`)
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
          {inputFields.map(({id, name, type}) => {
            return (
              <div className="nes-field">
                <label htmlFor={id}>{name}</label>
                <input
                  type={type}
                  id={id}
                  className="nes-input"
                  value={request[id]}
                  onChange={(event) => handleInputChange(event)}
                />
              </div>
            )
          })}
        </div>
        <div className="nes-field">
          <label htmlFor="itemDescription">Description:</label>
          <textarea
            id="itemDescription"
            className="nes-textarea"
            value={request["itemDescription"]}
            onChange={(event) => {handleInputChange(event)}}
          />
        </div>
        <div className='flex items-start my-10'>
          <EightBitButton onClick={handleAddItem}>ADD</EightBitButton>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
