import React from 'react';
import styles from './Tip.module.css'
import { Icon } from 'rsuite';

export default  function Tip({ text }) {
  return (
    <div className={styles.Tip}>
      <Icon style={{ fontSize: '20px', height: '20px' }} icon="creative"/>
      <span className={styles.TipLabel}>{ text }</span>
    </div>
  )
}
