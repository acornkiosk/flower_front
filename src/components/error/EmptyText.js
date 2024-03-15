import React from 'react';
import './emptyText.css'
import { Image } from 'react-bootstrap';
const EmptyText = ({message}) => {
  return (
    <div className='container'>
      <Image className="rounded mh-25" style={{maxHeight:"100px"}} alt="HTML" src="/images/emptyPage.png"></Image>
      {message}
    </div>
  );
}

export default EmptyText