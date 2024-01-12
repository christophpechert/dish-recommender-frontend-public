import React from 'react'

function Loading() {
    return (
        <div className='col-12 text-center'>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loading