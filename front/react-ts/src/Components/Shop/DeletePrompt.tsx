import React from "react";

import { Item } from './Items';

interface DeletePromptProps {
    item: Item | null;
    redirectToItemList: Function;
    update: Function;
    handleBackFromDeletePrompt: Function;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({item, redirectToItemList, update, handleBackFromDeletePrompt}) => {

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

    const renderDeletePrompt = (item: Item | null) => (
        <div className="nes-container is-dark with-title">
            <p className="title">{item?.itemName}</p>
          <section className="message-right" style={{marginRight:'50%'}}>
            <div className="nes-balloon from-left is-dark">
              <p style={{textAlign:'left'}}>You are about to delete this item. Are you sure?</p>
            </div>
          </section>
          <img style={{width:'80px', filter:'invert(0.9)'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
          <section className="message -right" style={{marginLeft:'30%'}}>
            <div style={{marginLeft:'30%', marginTop:'-50px'}}className="nes-balloon from-right is-dark">
              <p style={{textAlign:'left'}}>I decide things.</p>
                      <button className="nes-btn is-error" onClick={deleteItem}>Yes</button>
                <button className="nes-btn is-success" onClick={()=>{
                    handleBackFromDeletePrompt();
                }} style={{marginLeft:"10vh"}}>No</button>
            </div>
            <img style={{width: '100px', marginLeft:'88%'}} src={require('../Shop/avatar.png')} alt="My Icon" />
          </section>
        </div>
     
    );


    return (
        <>
       {renderDeletePrompt(item)}
       </>
    )
}

export default DeletePrompt;