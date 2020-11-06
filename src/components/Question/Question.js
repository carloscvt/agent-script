import React from 'react';
import { Input, InputPicker, Toggle } from 'rsuite';
import styles from './Question.module.css';

export const QuestionStr = ({ text, value, onChange, field }) => (
  <div className={styles.Container}>
    <div className={styles.VerticalCenter}>{text}</div>
    <div className={styles.VerticalCenter}>
      <Input value={value} onChange={(val) => onChange(val, field)}/>
    </div>
  </div>
)

export const QuestionBool = ({ text, centerToggle = false, value, onChange, field }) => (
  <div className={styles.Container}>
    <div className={styles.VerticalCenter}>{text}</div>
    <div 
      className={styles.VerticalCenter} 
      style={{ justifyContent: centerToggle ? 'center' : 'flex-start' }}
      >
      <Toggle checked={value} onChange={(val) => onChange(val, field)} size="lg" checkedChildren="Yes" unCheckedChildren="No" />
    </div>
  </div>
)

export const QuestionTwoFields = ({ text, fields = [], onChange }) => (
  <div className={styles.Container} >
    <div className={styles.VerticalCenter}>{text}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '120px 170px', columnGap: '10px', alignItems: 'center' }}>
      <div 
        style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '60px 1fr' }}
        >
        {fields[0].label}: <Input value={fields[0].value} onChange={(val) => onChange(val, fields[0].field)}/>
      </div>
      <div 
        style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '100px 1fr' }}
        >
        {fields[1].label}: <Input value={fields[1].value} onChange={(val) => onChange(val, fields[1].field)} />
      </div>
    </div>
  </div>
)

export const QuestionPicker = ({ text, opts, value, onChange, field }) => (
  <div className={styles.Container}>
    <div className={styles.VerticalCenter}>{text}</div>
    <InputPicker 
      cleanable={false}
      size="md"
      defaultValue={value}
      value={value}
      onSelect={(val, item) => onChange(val, field)}
      placeholder="Select..."
      data={opts}/>
  </div>
)