import React from 'react';
import IconReliancera from '../../assets/reliancera-icon.png';
import Card from '../Card/Card';
import { data } from '../../data';

const Annotation = ({ text }) => {

  return (
    <span style={{ color: '#f44336', textAlign: 'center', margin: '4px 0' }}>{text}</span>
  )

}

const Block = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent:'center', flexDirection: 'column' }}>
      {children}
    </div>
  )
}

export default function Sheet ({}) {

  const { outbound, inbound }  = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img width="300" src={IconReliancera} alt="icon"/>
      </div>

      <p style={{ textAlign: 'center', margin: '18px 0px !important' }}>I AM A TELESALES BEAST </p>

      <div style={{ display: 'grid', gridAutoRows: 'max-content', rowGap: '18px' }}>

        <Card title={outbound.title}>{ outbound.content.map(text => (<p>{ text } </p> )) }</Card>

        <Card title={outbound.title}>{ inbound.content.map(text => (<p>{ text } </p> )) }</Card>

        <Block>
          <Annotation text={'Call Control: Just want info/quote? “That’s exactly what I’m here for.”  Pivot back to script'}/>
          <Annotation text={'How I’m Going to Serve Your Need'}/>
        </Block>

        <Card title={outbound.title}>
          
        </Card>


      </div>


    </div>
  )

}