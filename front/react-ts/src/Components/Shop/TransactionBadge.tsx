import React from 'react';

type TransactionBadgeProps = {
    status: string;
    bagdeType: string;
};

const TransactionBadge: React.FC<TransactionBadgeProps> = ( { status, bagdeType }) => {


    const renderSplitBadge = () => (
            <div className="nes-badge is-splited" style={{width:'40%'}}>
                <span className="is-dark">Status</span>
                <span className={status === 'Awaiting' ? 'is-primary' : status === 'Reject' ? 'is-error' : 'is-success'}>
                    {status}
                </span>
            </div>            
    );

    const renderNormalBadge = () => (
        <div className="nes-badge" style={{}}>
                <span className={status === 'Awaiting' ? 'is-primary' : status === 'Reject' ? 'is-error' : 'is-success'}>
                    {status}
                </span>
            </div>  
    );

    return (
        <>
        {
            bagdeType === 'split' ? renderSplitBadge() : renderNormalBadge()
        }
        </>
    )

};

export default TransactionBadge;