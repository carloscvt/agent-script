import React from 'react';
import { Input, IconButton, Icon, ButtonToolbar } from 'rsuite'
import styles from './Referrals.module.css'

export default class Referrals extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      phone: '',
      email: '',
    }

  }

  render() {

    return (
      <div>
        <div className={`${styles.Header} ${styles.Row}`}>
          <div style={{ textAlign: 'center' }} >Name</div>
          <div style={{ textAlign: 'center' }} >Phone number</div>
          <div style={{ textAlign: 'center' }} >Email address</div>
          <div style={{ textAlign: 'center' }} >Action</div>
        </div>

        <div className={styles.Rows}>
          {
            this.props.data.map((e, i) => (
              <div className={styles.Row}>
                <Input onChange={(value) => this.updateReferral(i, value, 'name')} value={e.name}/>
                <Input onChange={(value) => this.updateReferral(i, value, 'phone')} value={e.phone}/>
                <Input onChange={(value) => this.updateReferral(i, value, 'email')} value={e.email}/>
                <ButtonToolbar style={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton onClick={() => this.props.onDelete(i)} color="red" icon={<Icon icon="trash"/>}/>
                </ButtonToolbar>
              </div>          
            ))
          }
        </div>

        <div className={styles.Row} style={{ marginTop: '4px' }}>
          <Input value={this.state.name} onChange={(value) => this.changeValue(value, 'name')}/>
          <Input value={this.state.phone} onChange={(value) => this.changeValue(value, 'phone')}/>
          <Input value={this.state.email} onChange={(value) => this.changeValue(value, 'email')}/>
          <ButtonToolbar style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={this.onInsert} disabled={!this.canInsert()} color="green" icon={<Icon icon="plus"/>}/>
          </ButtonToolbar>
        </div>
      </div>
    )

  }

  canInsert = () => {
    
    const {email, name, phone} = this.state;
    return email.length > 0 && name.length > 0 && phone.length > 0;

  }

  changeValue = (value, field) => {
    this.setState({ [field]: value })
  }

  onInsert = () => {

    const { phone, name, email } = this.state;
    this.props.onInsert({ phone, name, email })

    setTimeout(() => this.setState({ name: '', phone: '', email: '' }), 0);

  }

  updateReferral = (i, value, field) => {

    this.props.onUpdate(i, value, field);

  }

}