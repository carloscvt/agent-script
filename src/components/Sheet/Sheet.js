import React from 'react';
import IconReliancera from '../../assets/reliancera-icon.png';
import Card from '../Card/Card';
import { data } from '../../data';
import styles from './Sheet.module.css';
import { Timeline, Input, Toggle, InputPicker, TagPicker } from 'rsuite'

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

const QuestionStr = ({ text }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
    <div>{text}</div>
    <div><Input/> </div>
  </div>
)

const QuestionBool = ({ text }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
    <div>{text}</div>
    <div><Toggle size="lg" checkedChildren="Yes" unCheckedChildren="No" /></div>
  </div>
)

const QuestionTwoFields = ({ text }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
    <div>{text}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '120px 170px', columnGap: '10px', alignItems: 'center' }}>
      <div style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '60px 1fr' }}> Children: <Input/> </div>
      <div style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: '100px 1fr' }}> Grandchildren: <Input/> </div>
    </div>
  </div>
)

const QuestionPicker = ({ text, opts }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
    <div>{text}</div>
    <InputPicker size="md"
      placeholder="Select..."
      data={opts}/>
  </div>
)

export default function Sheet ({}) {

  const { two, inbound, peg }  = data;

  return (
    <div className={styles.Container}>

      <div className={styles.Header}>
        <img width="300" src={IconReliancera} alt="icon"/>
        <h3 className={styles.ScriptTitle}>Final Expense Script</h3>
      </div>

      <p className={styles.SP}>I AM A TELESALES BEAST </p>

      <div style={{ display: 'grid', gridAutoRows: 'max-content', rowGap: '18px' }}>


        <Card title={inbound.title}>{ inbound.content.map(text => (<p>{ text } </p> )) }</Card>

        {/* <Annotation text="How I’m Going to Serve Your Need"/> */}

        <Card title={two.title}>
          <div>
            <p>{two.content[0]}</p>
            <p>{two.content[1]}</p>
            <br/>
            <Timeline style={{ paddingLeft: '24px' }}>
              <Timeline.Item>We help thousands of people just like you find the right policy.</Timeline.Item>
              <Timeline.Item>We listen to your needs and find you a STATE APPROVED plan that is COMFORTABLE and AFFORDABLE for you each month.</Timeline.Item>
              <Timeline.Item>We're simply going to save you time and money today over the phone.</Timeline.Item>
            </Timeline>
            <br/>
          </div>
        </Card>

        <Card title="PEG - Praise, Empathy, & Gratitude as You Build Rapport, Take Notes as You Listen">
          <div>

            <p>{peg.content[0]}</p>
            <br/>

            <div style={{ padding: '0 36px' }}>
              <QuestionStr text="Speaking of fun, what do you do for fun? Favorite hobby?"/>
              <QuestionStr text="How long have you lived in <Client’s State>?"/>
              <QuestionStr text="Do you currently have Life Insurance?"/>
            </div>
            <br/>

            <p>{peg.content[1]}</p>
            <br/>
            <p>{peg.content[2]}</p>
            <br/>
            <p>{peg.content[3]}</p>

            <div style={{ padding: '0 36px' }}>
              <br/>
              <QuestionStr text="Who would be your beneficiary?"/>
              <QuestionBool text="Are you married?"/>
              <QuestionTwoFields text="How many children do you have? Grandchildren?"/>
              <QuestionStr text="If I had to write you a check to pay off all your debt today plus pay for your final arrangements, how much do you think I might need to write that out for?"/>
              <QuestionPicker 
                text="Are you currently employed, retired, or on social security disability?"
                opts={[
                  { label: 'Employed', value: 'Employed' },
                  { label: 'Retired', value: 'Retired' },
                  { label: 'Social security disability', value: 'social security disability' },
                ]}
                />

            </div>

          </div>
        </Card>

      </div>


    </div>
  )

}