import React from 'react';

export const preventClickPropagation = e => {
    e.stopPropagation();
    e.preventDefault();
}

export const ModalBackground = props => {
    return (
        <div onClick={preventClickPropagation}
            style={{
                position:'absolute',
                top:0,
                left:0,
                width:'100%',
                height:'100%',
                opacity:1
            }}
        >
            { props.children }
        </div>
    );
}
