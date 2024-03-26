
import React from 'react';
import 'nes.css/css/nes.min.css';
import './ItemDescription.css'; // Import custom styles

interface ItemDescriptionProps {
  title: string;
  description: string;
  price: number;
  course: string;
}

const ItemDescription: React.FC<ItemDescriptionProps> = ({
  title,
  description,
  price,
  course
}) => {
  return (
    <div className="item-description-container">
      <div className="nes-container with-title is-centered">
        <p className="title">{title}</p>
        <div className="field-container">
          <div className="nes-field">
            <label htmlFor="price_field">Points:</label>
            <input
              type="number"
              id="points_field"
              className="nes-input"
              value={price}
              readOnly
            />
          </div>
          <div className="nes-field">
            <label htmlFor="course_field">Course:</label>
            <input
              type="text"
              id="course_field"
              className="nes-input"
              value={course}
              readOnly
            />
          </div>
        </div>
        <div className="nes-field description-field">
          <label htmlFor="description_field">Description:</label>
          <textarea
            id="description_field"
            className="nes-textarea"
            value={description}
            readOnly
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemDescription;
