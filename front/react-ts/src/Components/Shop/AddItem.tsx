
import React, {useEffect, useState} from 'react';
import 'nes.css/css/nes.min.css';

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
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Creating Item...');
  const [stringOfExclamation, setStringOfExclamation] = useState('!');

    useEffect(() => {
        if (isLoading) {
            const t1 = setTimeout(() => {
                setLoaderMessage('Just a bit longer');
            }, 3000);

            const t2 = setTimeout(() => {
                setLoaderMessage('Almost done');
            }, 6000);

            const t3 = setInterval(() => {
                setStringOfExclamation((prev) => prev.length < 3 ? prev + '!' : '!');
            }, 500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearInterval(t3);
            };
        }
    }, [isLoading]);

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
    finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="item-description-container">
        {isLoading ? (
            <div className="loading-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                <p>{loaderMessage}{stringOfExclamation}</p>
            </div>
        ) : (<div className="nes-container with-title is-dark is-centered is-rounded" style={{
        width: '100vh',
        marginTop:'vh'
      }}>
        <p className="title">Add Item</p>
        <div className='field-container-two'>
              <div className="nes-field" >
                <label htmlFor='name'>Name</label>
                <input
                style={{backgroundColor:'#212529'}}
                  type='text'
                  id='name'
                  className="nes-input is-dark"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="nes-field">
                <label htmlFor='price'>Price</label>
                <input
                style={{backgroundColor:'#212529'}}
                  type='number'
                  id='price'
                  className="nes-input is-dark"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                />
              </div>
        </div>
        <div className="nes-field" style={{marginTop:'2vh'}}>
                <label htmlFor='description'>Description</label>
                <textarea
                  style={{backgroundColor:'#212529'}}
                  id='description'
                  className="nes-input is-dark"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </div>
        <div className='flex items-start my-10'>
          <button type="button" className='nes-btn is-success' onClick={()=>{
            handleBack();
          }}>Back</button>
          <button type="button" className='nes-btn is-primary' style={{marginLeft:'5vh'}} onClick={handleAddItem}>Add</button>
        </div>
      </div>)}
    </div>
  );
};

export default AddItem;
