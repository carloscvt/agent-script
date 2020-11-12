import fetch from 'isomorphic-unfetch';
import React from 'react';
import Currency from 'react-currency-formatter';
import { Checkbox, CheckboxGroup, Divider, Icon, IconButton, Input, InputGroup, InputPicker, Loader, Nav, Panel, Sidenav, Timeline } from 'rsuite';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import urljoin from 'url-join';
import { benefitDates, carriers, data, diseases, initialDraftDates, laborStatusOptions } from '../../data';
import { baseUrl, dev } from '../../utils';
import Annotation from '../Annotation/Annotation';
import Card from '../Card/Card';
import { QuestionBool, QuestionPicker, QuestionStr, QuestionTwoFields } from '../Question/Question';
import Referrals from '../Referrals/Referrals';
import styles from './Sheet.module.css';

const MySwal = withReactContent(Swal);


const Strong = ({ text, customStyles }) => {
return <span style={{  color: '#3498ff', fontSize: '20px', fontWeight: 500, ...customStyles }}>{text}</span>
}

const CustomInput = ({  width = 200, label, value, field, onChange }) => (
  <div style={{ width: `${width}px`, margin: '4px 6px' }}>
    <small>{label}:</small>
    <Input value={value} onChange={(val) => onChange(val, field)}/>
  </div>
)



const Quote = ({ label, faceAmount, costPerMonth, onChange = (i, field, value) => {}, index }) => {

  const toNumber   = val => val;
  const parseValue = val => val;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 160px 160px', alignItems: 'center', columnGap: '8px', justifyContent: 'center' }}>
      <span style={{ fontWeight: '500', textAlign: 'center', color: '#1675e0'}}>{label}</span>
      <InputGroup>
        <InputGroup.Addon>$</InputGroup.Addon>
        <Input
          type="number"
          style={{ textAlign: 'right' }}
          onChange={(val) => onChange(index, 'faceAmount', toNumber(val))}
          size="sm"
          value={parseValue(faceAmount)}
          />
      </InputGroup>
      <InputGroup>
        <InputGroup.Addon>$</InputGroup.Addon>
        <Input
          type="number"
          style={{ textAlign: 'right' }}
          onChange={(val) => onChange(index, 'costPerMonth', toNumber(val))}
          size="sm"
          value={parseValue(costPerMonth)}
          />
      </InputGroup>
    </div>
  )
}

const currencyFormat = (val) => <Currency symbol="$ " quantity={val} decimal="." locale="en" group="," />;

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
      paymentTypeOptions: [
        { label: 'Mailbox',             value: 1 },
        { label: 'Bank',                value: 2 },
        { label: 'Direct Express card', value: 3 },
        { label: 'Another payee',       value: 4 },
      ],
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
      q4: false,
      q5: false,
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
      phone: '',
      socialSecurityBenefitDate: null,
      initialDraftDate: null,
      initialDraftDates,
      benefitDate: null,
      benefitDates,

      quotes: [
        { value: 1, option: '1st', faceAmount: 0, costPerMonth: 0 },
        { value: 2, option: '2nd', faceAmount: 0, costPerMonth: 0 },
        { value: 3, option: '3rd', faceAmount: 0, costPerMonth: 0 },
      ],
      startCoverageAsSoonAsPossible: false,
      bankName: '',
      clientOwnsTheAccount: false,
      routingNumber: '',
      routingNumber2: '',
      accountNumber: '',
      accountNumber2: '',
      bettercheckResults: '',
      menu: [
        { ref: 'openingRef',              value: 0, label: 'Opening' },
        { ref: 'theNeedRef',              value: 1, label: 'The Need' },
        { ref: 'pegRef',                  value: 2, label: 'PEG' },
        { ref: 'qualifyRef',              value: 3, label: 'Qualify' },
        { ref: 'verificationRef',         value: 4, label: 'Verification ' },
        { ref: 'setTheStageRef',          value: 5, label: 'Set the Stage' },
        { ref: 'conversionCheckPointRef', value: 6, label: 'Conversion Checkpoint' },
        { ref: 'quotesRef',               value: 7, label: 'Quotes ' },
        { ref: 'applicationSectionRef',   value: 8, label: 'Application Section' },
        { ref: 'bankingRef',              value: 9, label: 'Banking ' },
        { ref: 'objectionsRef',           value: 10, label: 'Objections' },
        { ref: 'buttonsUpRef',            value: 11, label: 'Button Up ' },
        { ref: 'vipsRef',                 value: 12, label: 'VIPS ' },
        { ref: 'submitRef',               value: 13, label: 'Submit ' },

      ],
      selectedQuote: null,
      alert: {
        showCancelButton: true,
      },
      diseases,
      agent: 0,
    }

    this.openingRef = React.createRef();
    this.theNeedRef = React.createRef();
    this.pegRef = React.createRef();
    this.qualifyRef = React.createRef();
    this.verificationRef = React.createRef();
    this.setTheStageRef = React.createRef();
    this.conversionCheckPointRef = React.createRef();
    this.quotesRef = React.createRef();
    this.applicationSectionRef = React.createRef();
    this.bankingRef = React.createRef();
    this.objectionsRef = React.createRef();
    this.buttonsUpRef = React.createRef();
    this.vipsRef = React.createRef();
    this.submitRef = React.createRef();

  }

  async componentDidMount() {

    const winPathUrl    = window.location.href;
    const containParams = winPathUrl.includes('?');
    let recordID     = null;
    let agent     = null;

    if ( containParams ) {

      const params  = winPathUrl.substr(winPathUrl.indexOf('?')+1);
      const param = params.split('&');
      
      const recordIDParam = param.find(el => el.includes('rid'));
      const agentParam = param.find(el => el.includes('agent'));

      if ( recordIDParam && agentParam ) {

        const applicantIDStr = recordIDParam.substr(recordIDParam.indexOf('=') + 1).match(/(\d+)/);
        const agentParamStr = agentParam.substr(agentParam.indexOf('=') + 1).match(/(\d+)/);

        if (applicantIDStr && agentParamStr) {

          recordID = parseInt(applicantIDStr[0]);
          agent = parseInt(agentParamStr[0]);

          await this.setState({ recordID, agent })
          await this.fetchRecordData()
          
        } else {
          await this.setState({ isLoading: false })
        } 

      } else {
        await this.setState({ isLoading: false })
      }

      
    } else {
      this.setState({ isLoading: false })
    }


  }

  fetchRecordData = async () => {

    

    try {

      const agent = this.state.agent;

      const url = `${urljoin(baseUrl, `${this.state.recordID}`)}?agent=${agent ? agent : 0}`;

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }

      const request = await fetch(url, { headers, method: 'GET'});
      const json = await request.json();

      if (request.status === 200) {

        this.setState({
          ...json,
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

  jumpTo = (ref) => {

    const elementRef = this[ref] ? this[ref] : null;
    if (!elementRef) return;

    const currentEl = elementRef.current ? elementRef.current : null;
    if (!currentEl) return;
    
    const offsetTop =  currentEl ? currentEl.offsetTop : null;
    if (!offsetTop) return;
    
    console.log(elementRef)
    const cont = document.querySelector('#ContScroll');
    cont.scrollTo({ top: offsetTop, behavior: 'smooth' })

  }

  render() {

    if (this.state.isLoading) {
      return (
        <div>
          <Loader style={{ borderColor: 'red' }} backdrop speed="fast" vertical content="loading..." center size="md" />
        </div>
      )
    }

    if (!this.state.isLoading && (!this.state.recordID || !this.state.agent)) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <h3 style={{ fontWeight: 'bold' }}>Invalid Record</h3>
        </div>
      )
    }

    const { two, inbound, peg }  = data;
    const clientName = this.state.firstName ? this.state.firstName : '<Client Name>';
    const beneficiary = this.state.beneficiary ? this.state.beneficiary : '<Beneficiary>';
    const clientState = this.state.state;
  
    const findCarrier = this.state.carriers.find(e => e.value === this.state.selectedCarrier);
    const selectedCarrier = findCarrier ? findCarrier : {};

    const currentBenefitDate = this.state.benefitDate ? this.state.benefitDates.find(e => this.state.benefitDate === e.value).label : '<Benefit Date>';
  
  
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

            <QuestionPicker
              vertical
              text="Initial Draft Date:"
              opts={this.state.initialDraftDates}
              value={this.state.initialDraftDate}
              field="initialDraftDate"
              onChange={this.updateStrAnswer}
              />

            <QuestionPicker
              vertical
              text="Social Security Benefit Date:"
              opts={this.state.benefitDates}
              value={this.state.benefitDate}
              field="benefitDate"
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
              <IconButton 
                style={{ width: '160px', fontWeight:'500' }}
                color="blue"
                placement="right"
                onClick={this.submitData}
                icon={<Icon icon="send" />}
                >
                Submit
              </IconButton> 
            </div>


          </div>
        </div>



        <div className={styles.Content}>

        {/* -------- SideNav ---------- */}
        <div>
          <Sidenav appearance="inverse">
            <Sidenav.Body>
              <Nav>
                {
                  this.state.menu.map(e => (
                    <Nav.Item onClick={() => this.jumpTo(e.ref)} key={e.value} icon={<Icon icon="caret-right"/>}>{e.label}</Nav.Item>
                  ))
                }
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>



          {/* --------- Sheet -------- */}
          <div id="ContScroll" style={{ width: '100%', overflowY: 'auto' }}>

            <div className={styles.Container}>

              <div className={styles.Header}>
                <img width="300" src="https://reliancera.com/wp-content/uploads/2020/10/reliancerapng.png" alt="icon"/>
                <h3 className={styles.ScriptTitle}>Final Expense Script</h3>
              </div>
        
              <p className={styles.SP}>I AM A TELESALES BEAST </p>
        
              <div style={{ display: 'grid', gridAutoRows: 'max-content', rowGap: '28px' }}>
        
        
                <Card customRef={this.openingRef}>
                  <React.Fragment>
                    <Annotation text="The Opening for Inbound"/>
                    <p>{'I just want to make sure you have some background on us:'}</p>
                    <div>
                      { 
                        inbound.content.map(text => (<p>{ text } </p> ))
                      }
                    </div>
                  </React.Fragment>
                </Card>
        
                <Card customRef={this.theNeedRef}>
        
                  <Annotation text="How I’m Going to Serve Your Need" />
        
                  <div>
                    <p>
                      {'Again, '}
                      <Strong text={clientName} />
                      {', I\'m going to help you find coverage today and we are on a recorded line.'}</p>
                    <p>{two.content[0]}</p>
                    <br/>
                    <Timeline style={{ paddingLeft: '24px' }}>
                      <Timeline.Item>Reliancera is a company founded by licensed insurance agents.</Timeline.Item>
                      <Timeline.Item>With over 15 years of experience in the industry.</Timeline.Item>
                      <Timeline.Item>We focus on compassion before commission.</Timeline.Item>
                      <Timeline.Item>We help thousands of people just like you find the right policy.</Timeline.Item>
                      <Timeline.Item>We listen to your needs and find you a STATE APPROVED plan that is COMFORTABLE and AFFORDABLE for you each month.</Timeline.Item>
                      <Timeline.Item>We're simply going to save you time and money today over the phone.</Timeline.Item>
                    </Timeline>
                    <br/>
                  </div>
                </Card>
        
        
        
                <Card customRef={this.pegRef}>
        
                  <Annotation text="PEG"/>
                  <Annotation text={"Praise, Empathy, & Gratitude as You Build Rapport, Take Notes as You Listen"}/>
        
                  <div style={{ marginBottom: '24px' }}>
        
        
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
                          opts={this.state.paymentTypeOptions}
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
        
        
                <Card customRef={this.qualifyRef}>
        
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
                  {this.state.diseases.map(e => (
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
                  <QuestionBool field="q4" value={this.state.q4} onChange={this.updateStrAnswer} centerToggle text={'4. Has the Proposed Insured ever been diagnosed by a member of the medical profession with more than one occurrence of the same or different type of cancer or is the Proposed Insured currently receiving treatment (including taking medication) for any form of cancer (excluding basal cell skin cancer)?'} />
                  <QuestionBool field="q5" value={this.state.q5} onChange={this.updateStrAnswer} centerToggle text={'5. Is the insurance applied for intended to replace or change any life insurance, long term care insurance or annuity contract in force with this or any other company?'} />
        
                  <Annotation customStyles={{ marginTop: '32px' }} text={'If any question above is answered, “yes,” write policy through Great Western Insurance Company'} />
                  <Annotation customStyles={{ marginTop: '40px', marginBottom: '0px' }} text={'[IF REPLACING A POLICY AND THEY QUALIFY USE AETNA]'} />
        
                </div>
        
                <Divider/>
                <div style={{ height: '1px' }} ref={this.verificationRef}></div>
                <p style={{ marginTop: '36px' }}>I just want to verify that I have this information correct.</p>
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
                  
                <div ref={this.setTheStageRef}>
                  <Annotation text="If they appear to prequalify, set the stage."/>
                </div>
        
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
        
              <Card customRef={this.conversionCheckPointRef}>
        
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
        
                <div ref={this.quotesRef} >
                  <Annotation customStyles={{ marginTop: '42px', marginBottom: 0, fontSize: '20px' }} text="QUOTES"/>
                  <Annotation customStyles={{ marginTop: 0 }} text="(3 Face Amounts with Premiums Ranging from $100 / $70 / $60)"/>
                </div>
        
                <div style={{ display: 'flex', justifyContent:'center', marginBottom: '36px'}}>
                  <IconButton
                    color="blue"
                    onClick={() => { window.open('http://fexquotes.com/wqt/v1/webrate.pl?id=5554&fn=1&vrt=m&tgt=1&cpn=0&style=coolmint', '_blank', 'width=500,height=500,toolbar=no') }}
                    icon={<Icon icon="calculator" />}
                    >
                    Embed FEXQuoter
                    </IconButton>
                </div>


                <div className={styles.QuotesContainerOpts}>
                  <div style={{ display: 'grid', gridTemplateColumns: '48px 160px 160px', alignItems: 'center', columnGap: '8px', justifyContent: 'center' }}>
                    <small style={{ textAlign: 'center' }} >Option</small>
                    <small style={{ textAlign: 'center' }} >Face Amount</small>
                    <small style={{ textAlign: 'center' }} >Cost per Month</small>
                  </div>
                  <div style={{ display: 'grid', gridAutoRows: 'max-content', rowGap: '4px', gridTemplateColumns: 'max-content' }}>
                    {
                      this.state.quotes.map((q, i) => (
                        <Quote
                          index={i}
                          onChange={this.updateQuote}
                          label={q.option} 
                          faceAmount={q.faceAmount} 
                          costPerMonth={q.costPerMonth}
                          />
                      ))
                    }
                  </div>
                </div>
        
                <p>
                  {'Now '}
                  <Strong text={clientName}/>
                  {', I’m gonna get the elephant out of the room and then work my way... all the way down to the tiny ant for you, okay?'}
                </p>

                <p style={{ padding: '0 12px' }}>
                  {'The first option is '}
                  <Strong text={currencyFormat(this.state.quotes[0].faceAmount)} />
                  {' and that is only '}
                  <Strong text={currencyFormat(this.state.quotes[0].costPerMonth)} />
                  {' per month...did you get that one?'}
                </p>
                <p>
                  {'Ok great, let’s go over the second option which is for '}
                  <Strong text={currencyFormat(this.state.quotes[1].faceAmount)} />
                  {' and that is only '}
                  <Strong text={currencyFormat(this.state.quotes[1].costPerMonth)} />
                  {' per month, got that one?'}
                </p>
                <p>
                  {'And the third option is for '}
                  <Strong text={currencyFormat(this.state.quotes[2].faceAmount)} />
                  {' and that is only '}
                  <Strong text={currencyFormat(this.state.quotes[2].costPerMonth)} />
                  {' per month.'}
                </p>

                <br/>

        
                <Annotation customStyles={{fontSize: '20px'}} text="CLOSE"/>

                <QuestionPicker
                  text={(
                    <span>
                      {'So tell me '}
                      <Strong text={clientName}/>
                      {', which option would you want '}
                      <Strong text={beneficiary ? beneficiary : '<Beneficiary>'} />
                      {' to receive when that inevitable day comes,'}  {' a check for '} 
                      <Strong text={currencyFormat(this.state.quotes[0].faceAmount)} />
                      {' a check for '}
                      <Strong text={currencyFormat(this.state.quotes[1].faceAmount)} />
                      {', or a check for '}
                      <Strong text={currencyFormat(this.state.quotes[2].faceAmount)} />
                      {'?'}
                    </span>
                  )}
                  opts={this.state.quotes.map(e => ({ label: currencyFormat(e.faceAmount), value: e.value }))}
                  value={this.state.selectedQuote}
                  field="selectedQuote"
                  onChange={this.updateStrAnswer}
                  />
        
                <p>
                  <span style={{color: '#f44336'}}>(IF Customer decides):</span>
                  {'Awesome, that\'s the benefit that a lot of my clients pick! Go ahead and circle that!'}
                </p>
        
                <p>
                  {'How do you spell your last name? '}
                  <span style={{color: '#f44336'}}>(Go to APPLICATION PAGE)</span>
                </p>



                {/* Rebbutal */}
                <Panel header={<span style={{ color: '#f44336' }}>ONLY If the customer pushes back or indecisive</span>} collapsible bordered>
                  <p>
                    { 'That’s ok, '}
                    <Strong text={clientName} />
                    {', there’s no money involved today, so let’s go with the tiny ant option because that’s  most affordable. '}
                    <Strong text={clientName} />
                    {', you have a roof over your head to protect you from the elements, this will protect '}
                    <Strong text={beneficiary} />
                    {' from poverty, so let’s get you protected today. And when you’re able to add more coverage or need to make any changes, I’m here for you. But the last thing we want is to have a roof cave in on '}
                    <Strong text={beneficiary} />
                    {' So tell me, '}
                    <Strong text={clientName} />
                    {', what’s your middle initial? '}
                    <span style={{color: '#f44336'}}>(Go to APPLICATION INFO)</span>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>Pushed back?</span>} collapsible bordered>
                  <p>
                    {'I know you want to protect '}
                    <Strong text={beneficiary} />
                    {', is your only concern that you can’t afford '}
                    {'<tiny ant option> '}
                    {'each month? Does death and sickness run in your family? '}
                    <span style={{color: '#f44336'}}>(Wait for a response)</span>
                    {' of course it does, let’s get you protected today. How do you spell your last name?'}
                    <span style={{color: '#f44336'}}>(Go to APPLICATION INFO)</span>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>Last attempt to close via isolation</span>} collapsible bordered>
                  <p>

                    {'Outside of price, is there any other reason why you wouldn’t want to move forward? Here’s what I can do, I can get a special approval for you. Let me get my manager, hold on a moment, don’t go anywhere, we’ve been on the phone this long, I’m going to get you covered today. '}
                    <span style={{color: '#f44336'}}>Go on a short pause.</span>
                    {' Great news!! We were able to get you ($40 dollar range), again, you can always add more coverage later. I want to make sure I got this right, how do you spell your last name? '}
                    <span style={{color: '#f44336'}}>(Go to APPLICATION INFO)</span>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>ONLY if the $40 range is still too much</span>} collapsible bordered>
                  <p>
                    {'How much is comfortable and affordable for you? '}
                    <span style={{color: '#f44336'}}>(Go to APPLICATION INFO)</span>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>If you truly followed this process & they don’t buy after this and they’re still on the phone with you, they don’t trust you so ask politely.</span>} collapsible bordered>
                  <p>
                    {'What’s really holding you back? I can text you a copy of my insurance license. Would that make you feel more comfortable?'}
                  </p>
                </Panel>



                <div ref={this.applicationSectionRef}></div>

                <div  className={styles.ContainerCarrierButtons}>
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


                {/* <p>
                  <span style={{color: '#f44336'}}>If you truly followed this process & they don’t buy after this and they’re still on the phone with you, they don’t trust you so ask politely.</span>
                  {' What’s really holding you back? I can text you a copy of my insurance license. Would that make you feel more comfortable?'}
                </p> */}
        


                <Annotation text="ASKING FOR THE MONEY" customStyles={{fontSize: '20px', margin:'48px 0'}}/>


                <QuestionBool 
                  field="startCoverageAsSoonAsPossible" 
                  value={this.state.startCoverageAsSoonAsPossible} 
                  onChange={this.updateStrAnswer} 
                  centerToggle
                  text={(
                    <div>
                      <span>Now <Strong text={clientName} />, most people start their coverage as soon as possible. Does that work for you?</span>
                      <hr/>
                      <span style={{color: '#f44336'}}>{'(IF NO>FUTURE PAYMENT CLOSE)'}</span>
                    </div>
                  )}
                  />

                <p>{'GREAT so your bank will send your first premium as soon as possible and all future payments will be on the same day you receive your social security. This is the only way to make sure your policy never lapses. This is AWESOME isn’t it? '}</p>

                <QuestionPicker
                  opts={this.state.benefitDates}
                  value={this.state.benefitDate}
                  text="Excellent, when do you receive your government benefits on, the 1st, 3rd, 2nd Wed, 3rd Wed or 4th Wed of the month?"
                  onChange={this.updateStrAnswer}
                  field="benefitDate"
                />

                <br/>

                <Panel header={<span style={{ color: '#f44336' }}>FUTURE PAYMENT CLOSE</span>} collapsible bordered>
                  <p>
                  <QuestionPicker
                    opts={this.state.benefitDates}
                    value={this.state.benefitDate}
                    text={(
                      <span>
                        That’s okay <Strong text={clientName}/>, we work with the same payment schedule as social security. So, let’s keep it simple. Your first payment won’t be until the day you receive your benefits, what day do you receive yours on, the 1st, 3rd, 2nd Wed, 3rd Wed or 4th Wed of the month?
                      </span>
                    )}
                    onChange={this.updateStrAnswer}
                    field="benefitDate"
                  />
                  <br/>
                  <span>
                    {'Ok great, so your first payment won’t be until your benefits have been deposited on '}
                    <Strong text={currentBenefitDate} />
                    {' And we’ll set up your future payments to always come out the exact same way. Our system coincides with Social Security. Isn’t that great?'}
                  </span>
                  </p>
                </Panel>

                
                <div ref={this.bankingRef}></div>
                <Annotation customStyles={{fontSize: '20px', margin:'48px 0px 12px 0px'}} text="BANKING"/>
                <Annotation customStyles={{fontSize: '18px', margin:'12px 0px 36px 0'}} text="Talk Slow and Confident. Be sure to write everything down."/>

                <p>
                  Now, since our bank draft system is in tune with social security, this part is simple.
                </p>

                <div style={{ padding: '0px 36px 24px 36px' }}>
                  <QuestionStr 
                    text="What’s the name of your bank?"
                    value={this.state.bankName}
                    field="bankName"
                    onChange={this.updateStrAnswer}
                    />
                  <QuestionBool
                    text="Is this a checking or a savings account for you?"
                    value={this.state.clientOwnsTheAccount}
                    field="clientOwnsTheAccount"
                    onChange={this.updateStrAnswer}
                  />
                </div>



                <Annotation customStyles={{fontSize: '20px', margin:'48px 0px 12px 0px'}} text="CHECKING ACCOUNT"/>
                <Annotation customStyles={{fontSize: '18px', margin:'12px 0px 36px 0'}} text="(Check Google for Bank’s ROUTING #)"/>

                <p>
                  {'Ok, great I have some information that I need to verify with you. Please, grab your checkbook, take your time, just let me know when you’re ready. '}
                  <span style={{color: '#f44336'}}>(Take your time)</span>
                  {' I’m here for you.'}
                </p>

                <p>Please read me all the numbers at the bottom of a check starting from the left corner. </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1fr', columnGap: '12px', alignItems: 'center', padding: '0 24px'}}>
                  <QuestionStr 
                    text="Routing Number:"
                    value={this.state.routingNumber}
                    field="routingNumber"
                    onChange={this.updateStrAnswer}
                    />
                  
                  <Divider vertical />

                  <QuestionStr 
                    text="Account Number:"
                    value={this.state.accountNumber}
                    field="accountNumber"
                    onChange={this.updateStrAnswer}
                    />
                </div>

                <p>
                  {'Sometimes on the phone, fives sound like nines and nines sound like fives... I just want to make sure I heard you right. So, please '}
                  <span style={{ fontWeight: '500', fontSize: '24px', fontStyle: 'italic' }} >slowly</span>
                  {' read me all the numbers one more time in order starting from the left and let me know if you see any spaces in between.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1fr', columnGap: '12px', alignItems: 'center', padding: '0 24px'}}>
                  <QuestionStr 
                    text="Routing Number:"
                    value={this.state.routingNumber2}
                    field="routingNumber2"
                    onChange={this.updateStrAnswer}
                    />
                  
                  <Divider vertical />

                  <QuestionStr 
                    text="Account Number:"
                    value={this.state.accountNumber2}
                    field="accountNumber2"
                    onChange={this.updateStrAnswer}
                    />
                </div>

                <br/>

                <Panel header={<span style={{ color: '#f44336' }}>OBJECTIONS WITH BANKING</span>} collapsible bordered>
                  <p>
                    {'Don’t worry, we have a very secure system in place, your numbers are encrypted so I won’t be able to see your banking information, it gets covered up with X’s on my screen, go ahead, I’m ready whenever you are.'}
                  </p>
                </Panel>

                <QuestionStr 
                    text="Copy and Paste Bettercheck Results:"
                    value={this.state.bettercheckResults}
                    field="bettercheckResults"
                    onChange={this.updateStrAnswer}
                    />
                


                <div ref={this.objectionsRef}></div>
                <Annotation customStyles={{fontSize: '20px', margin:'48px 0'}} text="Objections"/>

                <Panel header={<span style={{ color: '#f44336' }}>Budget</span>} collapsible bordered>
                  <p>
                    <span style={{ fontWeight: 500 }}>"I completely understand."</span>
                    <Timeline style={{ padding: '24px 0 0 24px' }}>
                      <Timeline.Item>Other than price, is there any other reason why you wouldn't move forwards today?</Timeline.Item>
                      <Timeline.Item>Reliancera has more to offer than any of our competitors.</Timeline.Item>
                      <Timeline.Item>What price range are you trying to stay within?</Timeline.Item>
                    </Timeline>
                  </p>
                </Panel>


                <Panel header={<span style={{ color: '#f44336' }}>Send Email</span>} collapsible bordered>
                  <p>
                    <span>No problem. What’s the best email address for you?</span>
                    <Timeline style={{ padding: '24px 0 0 24px' }}>
                      <Timeline.Item>In addition to the pricing, what other information would be most helpful for you?</Timeline.Item>
                    </Timeline>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>Shopping Around</span>} collapsible bordered>
                  <p>
                    <span>"I understand why you’d want to consider multiple options."</span>
                    <Timeline style={{ padding: '24px 0 0 24px' }}>
                      <Timeline.Item>Which other companies are you considering?</Timeline.Item>
                      <Timeline.Item>Why don't we go ahead and fill out your application and see if we can get you qualified?</Timeline.Item>
                      <Timeline.Item>You do not have to pay anything today.</Timeline.Item>
                    </Timeline>
                    <Divider/>
                    <span>If customer insists on sending info:</span>
                    <Timeline style={{ padding: '24px 0 0 24px' }}>
                      <Timeline.Item>Absolutely, no problem.</Timeline.Item>
                      <Timeline.Item>How soon are you looking to get coverage?</Timeline.Item>
                      <Timeline.Item>I can call you back on [day] or this [day].</Timeline.Item>
                      <Timeline.Item>Thank you for your time, I will speak to you on [day] at [time]</Timeline.Item>
                    </Timeline>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>Not Interested</span>} collapsible bordered>
                  <p>                 
                    <span>That's OK, you aren't required to purchase anything today.</span><hr/>
                    <span>This is just for information purposes.</span>
                    <Timeline style={{ padding: '24px 0 0 24px' }}>
                      <Timeline.Item>Pivot back to the script</Timeline.Item>
                    </Timeline>
                  </p>
                </Panel>

                <Panel header={<span style={{ color: '#f44336' }}>Refusal to provide Social Security Number </span>} collapsible bordered>
                  <p>                 
                    <span>In order to verify you are who you say you are for official documents, what is your social?</span><hr/><br/>
                    <span>If the customer continues to push back say:</span>
                    <Timeline style={{ padding: '24px 0 0 24px' }}>
                      <Timeline.Item>That's OK, go ahead.</Timeline.Item>
                    </Timeline>
                  </p>
                </Panel>





                <div ref={this.buttonsUpRef}></div>
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
        
              <Card customRef={this.vipsRef}>
        
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

                <div ref={this.submitRef}></div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '320px' }}>
                <IconButton 
                  style={{ width: '160px', fontWeight:'500' }}
                  color="blue"
                  placement="right"
                  onClick={this.submitData}
                  icon={<Icon icon="send" />}
                  >
                  Submit
                </IconButton> 
                </div>
        
              </Card>
        
            </div>


          </div>


        </div>


      </div>
    )

  }

  generatePayload = () => {

    const { 
      accountNumber,
      accountNumber2,
      address,
      bankName,
      beneficiary,
      benefitDate: selectedBenefitDate,
      bettercheckResults,
      birthDate,
      children,
      city,
      clientOwnsTheAccount,
      email,
      faceAmmount: faceAmount,
      firstName,
      grandchildren,
      haveBankAccount,
      haveLifeInsurance,
      height,
      hobby,
      initialDraftDate: selectedInitialDraftDate,
      laborStatus: selectedLaborStatus,
      lastName,
      married,
      paymentType: selectedPaymentType,
      phone,
      q1, q2, q3a, q3b, q3c, q4, q5,
      recordID,
      referrals,
      routingNumber,
      routingNumber2,
      selectedCarrier,
      selectedDiseases,
      selectedQuote,
      smoked: smoker,
      startCoverageAsSoonAsPossible,
      state,
      timeLivedInState,
      weight,
      zip,
      agent,
    } = this.state;

    const laborStatus      = this.state.laborStatusOptions.find(e => e.value === selectedLaborStatus) ?? null;
    const paymentType      = this.state.paymentTypeOptions.find(e => e.value === selectedPaymentType) ?? null;
    const healthConditions = this.state.diseases.filter(e => selectedDiseases.some(x => x === e.value)) ?? null;
    const carrier          = this.state.carriers.find(e => e.value === selectedCarrier) ?? null;
    const quote            = this.state.quotes.find(e => e.value === selectedQuote) ?? null;
    const benefitDate      = this.state.benefitDates.find(e => e.value === selectedBenefitDate) ?? null;
    const initialDraftDate = this.state.initialDraftDates.find(e => e.value === selectedInitialDraftDate) ?? null;

    return JSON.stringify({
      laborStatus,
      paymentType,
      healthConditions,
      carrier,
      quote,
      socialSecurityBenefitDate: benefitDate,
      faceAmmount: faceAmount,
      smoker,
      address,
      bankName,
      beneficiary,
      city,
      email,
      firstName,
      lastName,
      children,
      grandchildren,
      q1, q2, q3a, q3b, q3c, q4, q5,
      height,
      hobby,
      initialDraftDate,
      state,
      timeLivedInState,
      weight,
      zip,
      agent,
      haveBankAccount,
      haveLifeInsurance,
      recordID,
      referrals,
      routingNumber,
      routingNumber2,
      startCoverageAsSoonAsPossible,
      accountNumber,
      accountNumber2,
      bettercheckResults,
      birthDate,
      clientOwnsTheAccount,
      married,
      phone,
    })

  }

  submitData = async () => {


    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to submit the form?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2196f3',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Continue',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: async () => {

        this.setState({ alert: { showCancelButton: false } })

        try {
          
          const body = this.generatePayload();

          const url = urljoin(baseUrl, `${this.state.recordID}`);
          const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      
          const request = await fetch(url, { headers, method: 'POST', body});
          const json = await request.json();

          if (request.status === 200) {
            console.log(json);
          } else {
            throw new Error('error');
          }
        
  
        } catch (error) {

          Swal.fire({
            title: 'An error has occurred',
            text: 'Please, contact with Support',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#f44336',
            confirmButtonText: 'Close',
            allowOutsideClick: false,
          })
          
        }

        return true;

      }
    }).then((result) => {

      if (result.isConfirmed) {
        Swal.fire({
          title: 'Saved successfully',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Close',
          allowOutsideClick: false,
          preConfirm: async () => {
            if (!dev) {
              window.location.replace("https://reliancera.com/");
            }
          }
        })
      }

    })

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

  updateQuote = (index, field, value) => {

    this.setState({
      quotes: this.state.quotes.map((e, i) => {

        if (i === index) return { ...e, [field]: value }

        return e;

      })
    })

  }

}
