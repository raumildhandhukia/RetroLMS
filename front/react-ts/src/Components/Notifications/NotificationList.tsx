import React, { useState, useEffect } from 'react';


interface NotificationProps {}

const NotificationList:React.FC<NotificationProps> = () => {
    console.log('NotificationList');
    return (
        <div>
            <h1>Notification List</h1>
        </div>
    );
}

export default NotificationList;
