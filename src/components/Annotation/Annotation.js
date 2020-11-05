import React from 'react';

const Annotation = ({ text, customStyles = {} }) => {

  return (
    <div style={{ color: '#f44336', textAlign: 'center', margin: '18px 0 36px 0', fontWeight: 500, fontSize: '16px', ...customStyles}}>{text}</div>
  )

}

export default Annotation;