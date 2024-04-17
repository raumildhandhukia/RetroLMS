import React from 'react';
import 'nes.css/css/nes.min.css';
import "./ItemList.css";
import { Item } from './Items';
import AddItem from './AddItem';
import ItemDescription from './ItemDescription';
import ItemCard from './ItemCard';
import './ItemCard.css';
import RequestList from './RequestList';


interface ItemListProps {
    items: Item[];
    courseId: string;
    role: string;
    update: Function;
    studentBalance: number;
}



const InstructorItemList: React.FC<ItemListProps> = ({ items, courseId, role, update, studentBalance }) => {
    const [createItem, setCreateItem] = React.useState<boolean>(false);
    const [showItem, setShowItem] = React.useState<boolean>(false);
    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
    const [showItemRequests, setShowItemRequests] = React.useState<boolean>(false);

    const handleItemDescription = (item: Item) => {
      setShowItem(true);
      setSelectedItem(item);
    };

    const handleItemRequest = (item: Item) => {
      setShowItemRequests(true);
      setSelectedItem(item);
    }

    const handleAddItem = () => {
      setCreateItem(true);
    }

    const handleBack = () => {
      setCreateItem(false);
      setShowItem(false);
      setShowItemRequests(false);
    }

    const renderItemDescription = () => (
      <ItemDescription selectedItem={selectedItem} update={update} role={role} handleBack={handleBack}/>
    );

    const handleBuyRequest = async (selectedItem:Item) => {
    try {
      const response = await fetch("http://localhost:8080/requestItem", {
        method: "POST",
        headers: {
                    'Content-Type': 'application/json'
                },
        credentials: 'include',
        body: JSON.stringify({
          itemId: selectedItem?._id,
          price: selectedItem?.itemPrice
        })
      });
      if (response.ok) {
        // getTransction();
      }
    } catch (error) {
      console.error("Error buying item.", error);
    } 
  };

  const renderNoShopComponent = () => (
    <div>
      <div className="">
        <div className="nes-container is-rounded with-title" style={{width:'100vh'}}>
          <p className="title">Shop</p>
          <section className="message-right">
            <div className="nes-balloon from-left is-dark" style={{ marginRight:'45%'}}>
              <p>{role === 'instructor' ? "please add some items professor":"please come back later for items."}</p>
            </div>
          </section>
          <i style={{}} className="nes-octocat animate"></i>
          <section className="message -right">
            <div style={{marginLeft:'40%'}}className="nes-balloon from-right is-dark">
              <p>{role === 'instructor' ? "my students could use some perks.":"waiting for that 'SKIP FINALS' perk."}</p>
            </div>
            <img style={{width: '100px', marginLeft:'88%'}} src={require('./avatar.png')} alt="My Icon" />
          </section>
        </div>
      </div>
      {role === 'instructor' && (
        <div className="flex items-start ml-6" style={{ marginTop: "10px" }}>
          <button type='button' className='nes-btn is-primary' onClick={handleAddItem}>Add Item</button>
        </div>
      )}
    </div>
  );


  const renderShopComponent = () => (
  <div className='nes-container is-rounded with-title'>
    <p className='title'>Shop</p>
    <div className="item-list-content ">
      {
      items.map((item, index) => (
        <ItemCard key={`item-${index}`} item={item} role={role} studentBalance={studentBalance}
          handleItemDescription={handleItemDescription} handleItemRequest={handleItemRequest}
          handleItemBuy={handleBuyRequest} />
      ))
      
      }
    </div>
    {role === 'instructor' && (
      <div className="flex items-start ml-6" style={{ marginTop: "10px" }}>
        <button type='button' className='nes-btn is-primary' onClick={handleAddItem}>Add Item</button>
      </div>
    )}
  </div>
);


    const renderAddItemComponent = () => (
      <AddItem courseId={courseId} update={update} handleBack={handleBack}/>
    );

    const renderRequestComponent = () => ( 
      <RequestList item={selectedItem} handleBack={handleBack}/>
    );
    


    return (
        <div className="item-list-container">
          {
          showItem ? 
            renderItemDescription() : 
            <div>
                  {
                    createItem ? renderAddItemComponent() : showItemRequests ? renderRequestComponent() : items.length ? renderShopComponent() : renderNoShopComponent()
                  }
            </div>
          }
          
        </div>
      );
    };
export default InstructorItemList;