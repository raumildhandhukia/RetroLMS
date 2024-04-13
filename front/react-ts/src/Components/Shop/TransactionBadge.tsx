import React from 'react';

type TransactionBadgeProps = {
    status: string;
};

const TransactionBadge: React.FC<TransactionBadgeProps> = ({ status }) => {

    return (
            <div className="nes-badge is-splited" style={{width:'40%'}}>
                <span className="is-dark">Status</span>
                <span className={status === 'Awaiting' ? 'is-primary' : status === 'Reject' ? 'is-error' : 'is-success'}>
                    {status}
                </span>
            </div>            
    );
};

export default TransactionBadge;