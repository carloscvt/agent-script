import React from 'react';
import { CheckPicker, Divider, Icon, IconButton, Input, InputPicker, Timeline, Loader, Button, CheckboxGroup, Checkbox } from 'rsuite';
import IconReliancera from '../../assets/reliancera-icon.png';
import { carriers, data, diseases, laborStatusOptions } from '../../data';
import Annotation from '../Annotation/Annotation';
import Card from '../Card/Card';
import { QuestionBool, QuestionPicker, QuestionStr, QuestionTwoFields } from '../Question/Question';
import Referrals from '../Referrals/Referrals';
import styles from './Sheet.module.css';
import fetch from 'isomorphic-unfetch'
import urljoin from 'url-join'
import { baseUrl } from '../../utils'

const Strong = ({ text, customStyles }) => {
return <span style={{  color: '#3498ff', fontSize: '20px', fontWeight: 500, ...customStyles }}>{text}</span>
}

const CustomInput = ({  width = 200, label, value, field, onChange }) => (
  <div style={{ width: `${width}px`, margin: '4px 6px' }}>
    <small>{label}:</small>
    <Input value={value} onChange={(val) => onChange(val, field)}/>
  </div>
)

export default class Sheet extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      referrals: [],
      hobby: '',
      timeLivedInState: 0,
      haveLifeInsurance: false,
      beneficiary: '',
      married: false,
      children: 0,
      grandchildren: 0,
      faceAmmount: 0,
      laborStatus: null,
      paymentType: null,
      haveBankAccount: false,
      selectedDiseases: [],
      smoked: false,
      height: 0,
      weight: 0,
      q1: false,
      q2: false,
      q3a: false,
      q3b: false,
      q3c: false,
      q4a: false,
      q5a: false,
      q6a: false,
      q7a: false,
      fullName: '',
      email: '',
      state: '',
      zip: '',
      address: '',
      selectedCarrier: null,
      carriers,
      firstName: '',
      lastName: '',
      isLoading: true,
      recordID: null,
      birthDate: '',
      laborStatusOptions,
      phone: ''
    }

  }

  async componentDidMount() {

    const winPathUrl    = window.location.href;
    const containParams = winPathUrl.includes('?');
    let recordID     = null;

    if ( containParams ) {

      const params  = winPathUrl.substr(winPathUrl.indexOf('?')+1);
      const param = params.split('&');
      
      const recordIDParam = param.find(el => el.includes('rid'));

      if ( recordIDParam ) {

        const applicantIDStr = recordIDParam.substr(recordIDParam.indexOf('=') + 1).match(/(\d+)/)[0];
        recordID = parseInt(applicantIDStr);

      }

      console.log(recordID)

      await this.setState({ recordID })
      await this.fetchRecordData()
      
    } else {
      this.setState({ isLoading: false })
    }
  }

  fetchRecordData = async () => {

    try {

      const url = urljoin(baseUrl, `${this.state.recordID}`);
      console.log(url)
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }

      const request = await fetch(url, { headers, method: 'GET'});
      const json = await request.json();

      if (request.status === 200) {

        this.setState({
          state: json.state,
          zip: json.zip,
          phone: json.phone,
          firstName: json.firstName,
          lastName: json.lastName,
          birthDate: json.birthDate,
          city: json.city,
          address: json.address,
          email: json.email,
          isLoading: false,
          fullName: `${json.firstName} ${json.lastName}`
        })

      } else {
        this.setState({
          isLoading: false,
          recordID: null,
        })
      }

    } catch (error) {
      console.log(error);
      this.setState({
        isLoading: false,
        recordID: null,
      })
    }

  }

  render() {

    if (this.state.isLoading) {
      return (
        <div>
          <Loader style={{ borderColor: 'red' }} backdrop speed="fast" vertical content="loading..." center size="md" />
        </div>
      )
    }

    if (!this.state.isLoading && !this.state.recordID) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <h3 style={{ fontWeight: 'bold' }}>Invalid Record</h3>
        </div>
      )
    }

    const { two, inbound, peg }  = data;
    const clientName = this.state.firstName;
    const beneficiary = this.state.beneficiary;
    const clientState = this.state.state;
  
    const findCarrier = this.state.carriers.find(e => e.value === this.state.selectedCarrier);
    const selectedCarrier = findCarrier ? findCarrier : {};
  
  
    return (
      <div style={{ position: 'relative' }}>
        <div className={styles.FloatContainer}>
          <div style={{ display:'flex', flexWrap: 'wrap', maxWidth: '1280px', margin: '0 auto', justifyContent:'center' }}>



            <CustomInput field="firstName" label="First Name" onChange={this.updateStrAnswer} value={this.state.firstName} />
            <CustomInput field="lastName" label="Last Name" onChange={this.updateStrAnswer} value={this.state.lastName} />
            <CustomInput field="birthDate" label="Birth Date" onChange={this.updateStrAnswer} value={this.state.birthDate} />
            <CustomInput field="email" label="Email" onChange={this.updateStrAnswer} value={this.state.email} />
            <CustomInput field="phone" label="Phone" onChange={this.updateStrAnswer} value={this.state.phone} />
            <CustomInput field="state" label="State" onChange={this.updateStrAnswer} value={this.state.state} />
            <CustomInput field="zip" label="Zip" onChange={this.updateStrAnswer} value={this.state.zip} />
            <CustomInput field="address" label="Address" onChange={this.updateStrAnswer} value={this.state.address} />
            <CustomInput field="height" label="Height" onChange={this.updateStrAnswer} value={this.state.height} />

            <CustomInput field="weight" label="Weight" onChange={this.updateStrAnswer} value={this.state.weight} />
            <CustomInput field="beneficiary" label="Beneficiary" onChange={this.updateStrAnswer} value={this.state.beneficiary} />
            <CustomInput field="faceAmmount" label="Face Amount" onChange={this.updateStrAnswer} value={this.state.faceAmmount} />

            <QuestionPicker
              vertical
              text="Labor Status:"
              opts={this.state.laborStatusOptions}
              value={this.state.laborStatus}
              field="laborStatus"
              onChange={this.updateStrAnswer}
              />

            <QuestionBool vertical centerToggle
              text="Currently have Life Insurance:"
              value={this.state.haveLifeInsurance}
              field="haveLifeInsurance"
              onChange={this.updateStrAnswer}
              />
            <QuestionBool vertical centerToggle
              text="Smoker:"
              value={this.state.smoked}
              field="smoked"
              onChange={this.updateStrAnswer}
              />

            <div style={{ display: 'flex', alignItems: 'flex-end', width: '200px', justifyContent: 'center' }}>
              <Button color="blue" style={{ fontWeight: 500, width: '148px' }} onClick={this.submitData}>Submit</Button>
            </div>
 

          </div>
        </div>

        <div className={styles.Content}>

          <div className={styles.Container}>

            <div className={styles.Header}>
              <img width="300" src="https://reliancera.com/wp-content/uploads/2020/10/reliancerapng.png" alt="icon"/>
              <h3 className={styles.ScriptTitle}>Final Expense Script</h3>
            </div>
      
            <p className={styles.SP}>I AM A TELESALES BEAST </p>
      
            <div style={{ display: 'grid', gridAutoRows: 'max-content', rowGap: '28px' }}>
      
      
              <Card>
                <React.Fragment>
                  <Annotation text="The Opening for Inbound"/>
                  <div>
                    { 
                      inbound.content.map(text => (<p>{ text } </p> ))
                    }
                  </div>
                </React.Fragment>
              </Card>
      
              <Card>
      
                <Annotation text="How I’m Going to Serve Your Need" />
      
                <div>
                  <p>
                    {'Again, '}
                    <Strong text={clientName} />
                    {', I\'m going to help you find coverage today and we are on a recorded line.'}</p>
                  <p>{two.content[0]}</p>
                  <br/>
                  <Timeline style={{ paddingLeft: '24px' }}>
                    <Timeline.Item>We help thousands of people just like you find the right policy.</Timeline.Item>
                    <Timeline.Item>We listen to your needs and find you a STATE APPROVED plan that is COMFORTABLE and AFFORDABLE for you each month.</Timeline.Item>
                    <Timeline.Item>We're simply going to save you time and money today over the phone.</Timeline.Item>
                  </Timeline>
                  <br/>
                </div>
              </Card>
      
      
      
              <Card>
      
                <Annotation text="PEG"/>
                <Annotation text={"Praise, Empathy, & Gratitude as You Build Rapport, Take Notes as You Listen"}/>
      
                <div>
      
      
                  <p>{peg.content[0]}</p>
      
      
                  <div style={{ padding: '0 36px', margin: '48px 0', gridAutoRows: 'max-content', rowGap: '12px', display: 'grid'}}>
                    <QuestionStr 
                      text="Speaking of fun, what do you do for fun? Favorite hobby?"
                      field="hobby"
                      value={this.state.hobby}
                      onChange={this.updateStrAnswer}
                      />
                    <QuestionStr 
                      text={ <span>How long have you lived in <Strong text={clientState}/>?</span>}
                      value={this.state.timeLivedInState}
                      field="timeLivedInState"
                      onChange={this.updateStrAnswer}
                      />
                    <QuestionBool 
                      text="Do you currently have Life Insurance?"
                      value={this.state.haveLifeInsurance}
                      field="haveLifeInsurance"
                      onChange={this.updateStrAnswer}
                      />
                  </div>
      
                  <p style={{ margin: '18px 0px !important' }}>
                    <span style={{ background: '#ffeb3b' }}>{'Thank you for sharing that with me, now, '}</span>
                    <Strong customStyles={{ color: '#f44336', background: '#ffeb3b' }} text={clientName}/> 
                    <span style={{ background: '#ffeb3b' }}>{' I\'m required by law to make sure you have my state license number. This way, you know I\'m licensed by the state to determine your eligibility today. My National license number is '}</span> 
                    <span>{'______. (take your time, let me know when you\'re ready).'}</span>
                  </p>
                  <p style={{ margin: '18px 0px !important' }}>
                    {'Thank you for writing that down. Now, I\'d love to know more about your situation to better understand how I can be of service. Let\'s walk through the things that your family might need to have relieved when that inevitable day comes.'}
                  </p>
                  <p style={{ margin: '18px 0px !important' }}>
                    {"First, let's discuss who you're wanting to protect, IF I can get you qualified TODAY:"}
                  </p>
      
      
      
                  <div style={{ padding: '0 36px', display: 'grid', gridAutoRows: 'max-content' }}>
      
                    <QuestionStr 
                      text="Who would be your beneficiary?"
                      value={this.state.beneficiary}
                      field="beneficiary"
                      onChange={this.updateStrAnswer}
                      />
                    <QuestionBool
                      text="Are you married?"
                      value={this.state.married}
                      field="married"
                      onChange={this.updateStrAnswer}
                    />
                    <QuestionTwoFields 
                      text="How many children do you have? Grandchildren?"
                      fields={[
                        { label: 'Children',      field: 'children'     , value: this.state.children },
                        { label: 'Grandchildren', field: 'grandchildren', value: this.state.grandchildren }
                      ]}
                      onChange={this.updateStrAnswer}
                      />

                    <QuestionStr 
                      text="If I had to write you a check to pay off all your debt today plus pay for your final arrangements, how much do you think I might need to write that out for?"
                      value={this.state.faceAmmount}
                      field="faceAmmount"
                      onChange={this.updateStrAnswer}
                      />

                    <QuestionPicker
                      text="Are you currently employed, retired, or on social security disability?"
                      opts={this.state.laborStatusOptions}
                      value={this.state.laborStatus}
                      field="laborStatus"
                      onChange={this.updateStrAnswer}
                      />
      
      
                    <Annotation customStyles={{ textAlign: 'left', marginTop: '36px' }} text="If they are no longer working, ask:"/>
      
                    <div style={{ paddingLeft: '32px' }}>
                      <QuestionPicker
                        text="Does your payment go to the mailbox, to the bank, or on one of those green Direct Express cards?"
                        opts={[
                          { label: 'Mailbox',             value: 1 },
                          { label: 'Bank',                value: 2 },
                          { label: 'Direct Express card', value: 3 },
                        ]}
                        value={this.state.paymentType}
                        field="paymentType"
                        onChange={this.updateStrAnswer}
                        />
                    </div>
                    
                    {/* <div style={{ paddingLeft: '72px' }}>
                      <Annotation customStyles={{ textAlign: 'left', marginTop: '36px', paddingLeft: '10px'}} text="If by mailbox:"/>
                      <div  style={{ paddingLeft: '0px' }}>
                        <QuestionBool 
                          text="Okay do you have a bank account,  Direct Express card or a different payee?"
                          field="haveBankAccount"
                          value={this.state.haveBankAccount}
                          onChange={this.updateStrAnswer}
                          />
                      </div>
      
                      <Annotation 
                        customStyles={{ textAlign: 'left', marginTop: '36px', paddingLeft: '10px', fontSize: '18px'}}
                        text="If not STOP and thank the customer for their time."
                        />

                    </div> */}
      
      
                  </div>
      
      
      
                </div>
              </Card>
      
      
              <Card>
      
                <Annotation text={'Building Significant Value & Authority as You Qualify'}/>
      
              <Timeline style={{ paddingLeft: '24px' }}>
                <Timeline.Item>All insurance companies look at people differently...based on their age, health, & lifestyle.</Timeline.Item>
                <Timeline.Item>To help you best, I'm going to ask you a couple of health and lifestyle questions.</Timeline.Item>
                <Timeline.Item>This helps me... help YOU get the biggest bang for your buck! </Timeline.Item>
              </Timeline>
              <br/>
      
              <p>
                {'So you know '}
                <Strong text={clientName}/>
                {', I don’t work for any particular insurance company, so I don’t have a dog in this fight today, I just simply fight and work FOR YOU, okay?'}
              </p>
              <p>{'Great! Let’s see if I can get you pre approved without having to do a medical exam. I just have a few health questions for you….'}</p>
      
              <Divider/>
              <p>
                {'So, tell me '}
                <Strong text={clientName} />
                {', do you have any challenges with your health?'}
              </p>
      
      
      
              <CheckboxGroup onChange={selectedDiseases =>  this.setState({ selectedDiseases })} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                {diseases.map(e => (
                  <Checkbox checked={this.state.selectedDiseases.some(sd => sd === e.value)} value={e.value}>{e.label}</Checkbox>
                ))}
              </CheckboxGroup>
      
      
              <br/>
              <br/>
      
      
      
              <Divider/>
              
              <p>
                {'Do you smoke or chew, or chase any men/women that do? '}
                <span style={{color: '#f44336'}}>Make them laugh</span>
              </p>
      
              <div style={{ padding: '0px 36px 24px 36px' }}>
      
                <QuestionBool 
                  text={'Has the Proposed Insured smoked cigarettes in the past 12 months? '}
                  field="smoked"
                  value={this.state.smoked}
                  onChange={this.updateStrAnswer}
                  />
      
                <QuestionTwoFields 
                  text="What’s your height and weight?" 
                  fields={[
                    { label: 'Height', field: 'height', value: this.state.height },
                    { label: 'Weight', field: 'weight', value: this.state.weight }
                  ]}
                  onChange={this.updateStrAnswer}
                  />
      

      
                <QuestionBool
                  field="q1"
                  value={this.state.q1}
                  onChange={this.updateStrAnswer}
                  centerToggle text={'1. Is the Proposed Insured currently or in the last 30 days been: hospitalized, committed to a psychiatric facility, confined to a nursing facility, receiving hospice or home health care, confined to a wheelchair due to a disease, or waiting for an organ transplant?'} />
                <QuestionBool
                  field="q2"
                  value={this.state.q2}
                  onChange={this.updateStrAnswer}
                  centerToggle text={'2. Does the Proposed Insured currently require human assistance or supervision with eating, dressing, toileting, transferring from bed to chair, walking, maintaining continence or bathing?'} />
      
                <p style={{ paddingLeft: '8px' }}>{'3. Within the past 12 months has the Proposed Insured:'}</p>
                <div style={{ paddingLeft: '32px', paddingBottom: '38px' }}>
                  <QuestionBool 
                    field="q3a"
                    value={this.state.q3a}
                    onChange={this.updateStrAnswer}
                    centerToggle text={'a. been advised by a member of the medical profession to have a diagnostic test (other than an HIV test), surgery, home health care or hospitalization which has not yet started, been completed or for which results are not known?'} />
                  <QuestionBool 
                    field="q3b"
                    value={this.state.q3b}
                    onChange={this.updateStrAnswer}
                    centerToggle text={'b. used or been advised by a member of the medical profession to use oxygen equipment for assistance in breathing (excluding CPAP or nebulizer)? '} />
                  <QuestionBool 
                    field="q3c"
                    value={this.state.q3c}
                    onChange={this.updateStrAnswer}
                    centerToggle text={'c. had or been advised by a member of the medical profession to have Kidney Dialysis or Cirrhosis? '} />
                </div>
      
                {/* <p style={{ paddingLeft: '8px' }}>{'4. Has the Proposed Insured ever:'}</p>
                <div style={{ paddingLeft: '32px', paddingBottom: '38px' }}>
                  <QuestionBool
                    field="q4a"
                    value={this.state.q4a}
                    onChange={this.updateStrAnswer} 
                    centerToggle text={'a. been diagnosed with Acquired Immunodeficiency Syndrome (AIDS) or Aids-related Complex (ARC) by a medical professional; or Human Immuniodeficiency Virus (HIV)?'} />
                </div> */}

                {/* <QuestionBool field="q5a" value={this.state.q5a} onChange={this.updateStrAnswer} centerToggle text={'5. Has the Proposed Insured ever been diagnosed or received treatment by a member of the medical profession for Alzheimer’s disease, dementia, Lou Gehrig’s/Amyotrophic Lateral Sclerosis (ALS).'} /> */}
                <QuestionBool field="q6a" value={this.state.q6a} onChange={this.updateStrAnswer} centerToggle text={'6. Has the Proposed Insured ever been diagnosed by a member of the medical profession with more than one occurrence of the same or different type of cancer or is the Proposed Insured currently receiving treatment (including taking medication) for any form of cancer (excluding basal cell skin cancer)?'} />
                <QuestionBool field="q7a" value={this.state.q7a} onChange={this.updateStrAnswer} centerToggle text={'7. Is the insurance applied for intended to replace or change any life insurance, long term care insurance or annuity contract in force with this or any other company?'} />
      
                <Annotation customStyles={{ marginTop: '32px' }} text={'If any question above is answered, “yes,” write policy through Great Western Insurance Company'} />
                <Annotation customStyles={{ marginTop: '40px', marginBottom: '0px' }} text={'[IF REPLACING A POLICY AND THEY QUALIFY USE AETNA]'} />
      
              </div>
      
              <Divider/>
      
              <p>I just want to verify that I have this information correct.</p>
              <div style={{ padding: '0 20px' }}>
      
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1fr', marginBottom: '24px'}}>
                  <div className={styles.ContainerFullName}>
                    <span>Your full name is:</span>
                    {/* <QuestionStr field="fullName" value={this.state.fullName} onChange={this.updateStrAnswer} text="Your full name is:"/> */}
                    <CustomInput field="firstName" label="First Name" onChange={this.updateStrAnswer} value={this.state.firstName} />
                    <CustomInput field="lastName" label="Last Name" onChange={this.updateStrAnswer} value={this.state.lastName} />
                  </div>
                  
                  <Divider style={{ height: '100%' }} vertical/>
                  <QuestionStr field="email" value={this.state.email} onChange={this.updateStrAnswer} text="Your email address is:"/>
                </div>
      
                <div style={{ display: 'grid', gridTemplateColumns: '236px 1fr' }}>
                  <p>You are located in:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 1fr', columnGap: '12px' }}>
                    <div>
                      <small>State:</small>
                      <Input value={this.state.state} onChange={val => this.setState({ state: val })}/>
                    </div>
                    <div>
                      <small>Zip:</small>
                      <Input value={this.state.zip} onChange={val => this.setState({ zip: val })}/>
                    </div>
                    <div>
                      <small>Address:</small>
                      <Input value={this.state.address} onChange={val => this.setState({ address: val })}/>
                    </div>
                  </div>
                </div>
      
              </div>
      
              <Divider/>
      
              <Annotation text="If they appear to prequalify, set the stage."/>
      
              <p>
                <Strong text={clientName} />
                {' Based on the preliminary questions you just answered, my job is to find the company that’s going to look at you best.'}
              </p>
      
              <p>
                {'Thank you for your patience while I pull this up for you.'}
              </p>
      
              <div style={{ display: 'flex', flexDirection: 'column', width: '420px', margin: '36px auto 42px' }}>
                <small style={{ fontWeight: '500', color: '#3498ff', paddingLeft: '6px' }}>Carriers:</small>
                <InputPicker 
                  defaultValue={this.state.selectedCarrier}
                  value={this.state.selectedCarrier}
                  cleanable={false} size="md"
                  placeholder="Select a carrier"
                  data={carriers}
                  onSelect={selectedCarrier => this.setState({ selectedCarrier })}
                  />
              </div>
      
              <p>
                {'Okay, looks like '}
                <Strong text={selectedCarrier.label ? selectedCarrier.label : '<CARRIER>'} />
                {' might be the best option for you.  They’re located in '}
                <Strong text={selectedCarrier.address ? selectedCarrier.address : '<CARRIER LOCATION>'}/>
                {'.  Most importantly, '}
                <Strong text={selectedCarrier.label ? selectedCarrier.label : '<CARRIER>'}/>
                {' has an A Rating with the AM Best, so your family will be in great hands, ok -?-'}
                <span></span>
              </p>
      
              <p>
                {'Great '}
                <Strong text={clientName}/>
                {', now, in my professional opinion, a whole life insurance plan is the best option to provide for your family the protection that they’re going to need. This will be with you for your whole life, it’ll leave '}
                <Strong text={beneficiary}/>
                {' with a guaranteed 100% tax free benefit upon your inevitable passing. This is what you want, isn’t it?'}
              </p>
              <p>
                {'Exactly, that’s why we’re on the phone today! Also, you may borrow against your policy in case of an emergency, you can think of it like how equity builds in a home.'}
              </p>
              <p>
                {' With this policy, your premiums will always be locked in, the death benefit will never decrease, and if we get you qualified today, you’ll be covered from day one, you’ll never be dropped or cancelled by the company, and lastly, it will stay with you, your whole life, which is what you want isn’t it?'}
              </p>
      
              <p>
                {'Pretty awesome isn’t it?'}
              </p>
      
              <p>
                {'I couldn’t agree more! '}
                <Strong text={clientName} />
                {', grab that pen and paper again, and let me know when you’re ready.'}
              </p>
      
              <p>
                {'Great! My job is to make sure you’re 100% confident in the decision to move forward. Next to my name and license number, go ahead and write down my direct number _________.'}{/* and extension ____.'} */}
              </p>
      
              <p>
                {'I’ll be your agent for life and I’m here for you every step of the way through the underwriting process.'}
              </p>
      
            </Card>
      
      
            </div>
      
            <br/>
            <br/>  
      
            <Card>
      
              <Annotation customStyles={{ textAlign: 'left' }} text="Conversion Checkpoint"/>
      
              <p>{'I know this is a lot of great information to take in, but do you have any questions before we check your eligibility to apply?'}</p>
              <p>{'Now, we don’t take any chances on you getting sick and forgetting to mail in your payment because we had a client who took that chance, they got a terminal illness, and was no longer insurable.'}</p>
              <p>{'Needless to say we don’t let our clients take that chance anymore, and I especially don\'t want that to happen to you. So, you have two easy options...you can either pay annually or monthly. And we simply set everything up with your bank just like your social security, ok?'}</p>
              <p>{'Great! Now the insurance company is getting back with me, hold on and let me see what they’re saying here real quick.'}</p>
      
      
              <Annotation customStyles={{ fontSize: '20px' }} text="THE CONGRATS"/>
      
              <p>
                {'OH YEAH!! GOT SOME GOOD NEWS FOR YOU '}
                <Strong text={clientName} />
                {', IT LOOKS LIKE YOU’RE ELIGIBLE TO APPLY FOR THE BEST PLAN IN ALL OF '}
                <Strong text={clientState} />
                {'! THIS IS AMAZING, CONGRATS! '}
                <span style={{color: '#f44336'}}>(Pause for Response)</span>
              </p>
      
              <p>
                {'Also, '}
                <Strong text={clientName}/>
                {', we are going to send you a free final wishes guide. Many of our clients use this like a living will and testament. This will just help relieve some of the emotional stress from '}
                <Strong text={beneficiary}/>
                {' at the time of your inevitable passing. That would make it a lot less stressful on them, wouldn’t it? '}
                <span style={{color: '#f44336'}}>(Pause for Agreement)</span>
              </p>
      
              <p><Strong text={clientName}/> {', okay grab that pen and paper one last time for me.'}</p>
              <p>{'Ok great! I am going to share three outstanding options with you, are you ready?'}</p>
      
              <Annotation customStyles={{ marginTop: '42px', marginBottom: 0, fontSize: '20px' }} text="QUOTES"/>
              <Annotation customStyles={{ marginTop: 0 }} text="(3 Face Amounts with Premiums Ranging from $100 / $70 / $60)"/>
      
              <div style={{ display: 'flex', justifyContent:'center' }}>
                <IconButton
                  color="blue"
                  onClick={() => { window.open('http://fexquotes.com/wqt/v1/webrate.pl?id=5554&fn=1&vrt=m&tgt=1&cpn=0&style=coolmint', '_blank', 'width=500,height=500,toolbar=no') }}
                  icon={<Icon icon="calculator" />}
                  >
                  Quotes Calculator
                  </IconButton>
              </div>
      
              <p>
                {'Now '}
                <Strong text={clientName}/>
                {', I’m gonna get the elephant out of the room and then work my way... all the way down to the tiny ant for you, okay?'}
              </p>
              <p>
                {'The first option is <<$____>> and that is only <<$____>> per month...did you get that one?'}
              </p>
              <p>
                {'Ok great, let’s go over the second option which is for <<$____>> and that is only <<$____>> per month, got that one?'}
              </p>
              <p>
                {'And the third option is for <<$___>> and that is only <<$____>> per month.'}
              </p>
      
              <Annotation customStyles={{fontSize: '20px'}} text="CLOSE"/>
      
              <p>
                {'So tell me '}
                <Strong text={clientName}/>
                {', which option would you want '}
                <Strong text={beneficiary} />
                {' to receive when that inevitable day comes, a check for $_____, a check for$_______, or a check for $________?'}
              </p>
      
              <p>
                <span style={{color: '#f44336'}}>(IF Customer decides):</span>
                {'Awesome, that\'s the benefit that a lot of my clients pick! Go ahead and circle that!'}
              </p>
      
              <p>
                {'How do you spell your last name? '}
                <span style={{color: '#f44336'}}>(Go to APPLICATION PAGE)</span>
              </p>
      
      
              <div className={styles.ContainerCarrierButtons}>
                {
                  carriers.map(e => (
                    <div className={styles.ImgButton} onClick={() => { window.open(e.url, '_blank', 'width=960,height=500,toolbar=no') }}>
                      <img src={e.img} alt="carrier.jpg"/>
                    </div>
                  ))
                }
              </div>

              <div className={styles.ContainerCarrierButtons}>
                <IconButton onClick={() => { window.open('https://reliancera.com/agents', '_blank', 'width=960,height=500,toolbar=no') }} color="green" icon={<Icon icon="check-square-o"/>}>Checking / Savings Verification</IconButton>
              </div>


              <p>
                <span style={{color: '#f44336'}}>If you truly followed this process & they don’t buy after this and they’re still on the phone with you, they don’t trust you so ask politely.</span>
                {' What’s really holding you back? I can text you a copy of my insurance license. Would that make you feel more comfortable?'}
              </p>
      
              <Annotation customStyles={{fontSize: '20px', margin:'48px 0'}} text="Button Up"/>
      
      
              <p>Awesome {<Strong text={clientName}/>} WE’RE GOOD, you should be getting a welcome packet in the mail in a few weeks.</p>
              <p>{<Strong text={clientName}/>} how do you feel about the coverage you put in place today? (Wait for Response) </p>
              <p>I just want to tell you, you’re awesome for protecting <Strong text={beneficiary}/>. </p>
              <p>I’m really curious {<Strong text={clientName}/>} what was the driving force behind your wise decision today? (Wait for Response) </p>
              <p>Wow, thank you for sharing that with me {<Strong text={clientName}/>}, we’re committed to making sure the money will be readily available for <Strong text={beneficiary}/>. </p>
              <p>Likewise, I know you’re committed to making sure you have the funds available for your bank to make the monthly premiums. </p>
              <p>In other words, you can count on us and we can count on you, isn’t that right, {<Strong text={clientName}/>}? </p>
              <p>It’s my job to make sure you’re aware of every little detail, so real quick, I want you to be mindful that sometimes it can take a few days from your benefit date for your bank to make the premium payment for you, mostly when it falls on weekends or holidays., </p>
              <p>So just be sure that there’s enough in there to cover your insurance payment so your policy won’t lapse, okay? </p>
              <p>Great! </p>
            </Card>
      
            <br/>
            <br/>
      
            <Card>
      
              <Annotation text={'Asking for Referrals without Pushing or Begging - Using VIPS'}/>
      
              <Annotation text="Value"/>
              <p>
                {'I’ve really enjoyed talking with you today. You’ve been so gracious answering all the questions I’ve had for you. I’m curious, what part of the process did you find most valuable? '}
                <span style={{color: '#f44336'}}>(wait for a response)</span>
              </p>
      
              <Annotation text="Importance "/>
              <p>
                {'That’s great, I know you see the value in the work I do. I’m glad you requested the information so I could serve you today. With that in mind, I have an important question to ask you? '}
                <span style={{color: '#f44336'}}>(wait for a response)</span>
              </p>
              <Annotation text="Permission to Brainstorm - "/>
              <p>
                {'I was hoping to get your permission to brainstorm for a moment, about who you know who might truly value the work I do. I have a few ideas to run by you. Would you be open to this for a moment. '}
                <span style={{color: '#f44336'}}>(wait for a response)</span>
                {' We’re just brainstorming here and I’ve given this some thought.'}
              </p>
      
              <Annotation text={'Suggest Names & Categories - '}/>
      
              <p>
              Thanks <Strong text={clientName}/>, you mentioned {'<'} <Strong text={beneficiary}/>, Any Family Members they mentioned while on the phone{'>'} let’s start with them. Do you think they should at least know about what I do? Can we craft a way for you to introduce me to them that would feel comfortable to all concerned?
              </p>

      
      
              <Referrals 
                data={this.state.referrals}
                onDelete={this.onDeleteReferral}
                onInsert={this.insertReferral}
                onUpdate={this.updateReferral}
                />
      

      
              <p>
                <span style={{color: '#f44336'}}>{'If they’re stuck> '}</span>
                {'who do you think that might spend a few moments with me just because you asked?'}
              </p>
      
              <p>
                {'“I appreciate you making an electronic handshake for me, what’s their phone number? Would you be open to doing a 3 way call together or I can call them directly, I’ll be sure to give you some time after we get off the phone to tell them about this nice agent who helped you today” '}
              </p>
      
              <p>
                {'If they push back, just ask if it’s okay if you email or text them once the call is over.'}
              </p>
      
      
              <Annotation text="COOL DOWN" />
              <p>A referral really means a lot and helps me help more people. Don’t keep me a secret!</p>
              <p>What are you getting into the rest of the day? </p>
              <p>Stay out of trouble! </p>
              <p>I’ll give you back the rest of your day. </p>
              <p>My pleasure to serve you today <Strong text={clientName}/> </p>
              <p>Bye for now.</p>
      
            </Card>
      
          </div>

        </div>
      </div>
    )

  }

  submitData = () => {
    console.log(this.state);
    const { 
      firstName, 
      lastName, 
      birthDate, 
      email, 
      phone, 
      state, 
      zip, 
      address, 
      height, 
      weight, 
      beneficiary, 
      faceAmmount: faceAmount, 
      laborStatus, 
      haveLifeInsurance, 
      smoked: smoker,
    } = this.state;
  }

  onDeleteReferral = (i) => {

    this.setState({
      referrals: this.state.referrals.filter((e, index) => index !== i),
    })


  }

  insertReferral = (newReferral) => {

    this.setState({
      referrals: [...this.state.referrals, newReferral]
    })

  }

  updateReferral = (i, value, field) => {

    this.setState({
      referrals: this.state.referrals.map((e, indexRef) => {

        if (indexRef === i) return {...e, [field]: value}

        return e

      })
    })

  }

  updateStrAnswer = (value, field) => {

    this.setState({ [field]: value })

  }


}
