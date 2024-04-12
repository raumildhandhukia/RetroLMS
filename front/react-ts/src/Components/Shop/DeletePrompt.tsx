import React from "react";

import { Item } from './Items';

interface DeletePromptProps {
    item: Item | null;
    redirectToItemList: Function;
    update: Function;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({item, redirectToItemList, update}) => {

   const deleteItem =  async () => {
        try {
            const item_id = item?._id;
            const response = await fetch('http://localhost:8080/items/'+item_id, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Something went wrong!');
            }
        update();
        redirectToItemList();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };


    return (
        <div>
            <div id="delete-prompt">
                Are you sure you want to delete this Item?
            </div>
            <div>
                <button onClick={deleteItem} style={{ marginRight: '20px' }} className='nes-btn is-error'>Yes</button>
                <button onClick={()=>{redirectToItemList()}} className="nes-btn is-primary">No</button>
            </div>
            
        </div>
    )
}

export default DeletePrompt;