import React from 'react';
import { Input, InputPicker, Toggle } from 'rsuite';
import styles from './Question.module.css';

export const QuestionStr = ({ text }) => (
  <div className={styles.Container}>
    <div className={styles.VerticalCenter}>{text}</div>
    <div className={styles.VerticalCenter}><Input/> </div>
  </div>
)

export const QuestionBool = ({ text }) => (
  <div className={styles.Container}>
    <div className={styles.VerticalCenter}>{text}</div>
    <div className={styles.VerticalCenter}><Toggle size="lg" checkedChildren="Yes" unCheckedChildren="No" /></div>
  </div>
)

export const QuestionTwoFields = ({ text, fields = [] }) => (
  <div className={styles.Container} >
    <div className={styles.VerticalCenter}>{text}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '120px 170px', columnGap: '10px', alignItems: 'center' }}>
      <div style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '60px 1fr' }}> {fields[0].label}: <Input/> </div>
      <div style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '100px 1fr' }}>{fields[1].label}: <Input/> </div>
    </div>
  </div>
)

export const QuestionPicker = ({ text, opts }) => (
  <div className={styles.Container}>
    <div className={styles.VerticalCenter}>{text}</div>
    <InputPicker cleanable={false} size="md"
      placeholder="Select..."
      data={opts}/>
  </div>
)