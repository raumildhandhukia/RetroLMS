import React from 'react';
import "./Loader.css";

interface LoaderProps {
    style: any;

}
const Loader:React.FC<LoaderProps> = ({style}) => {
    return (
            <div className="pixel-loader" style={
                style
            }></div>
    )
};

export default Loader;