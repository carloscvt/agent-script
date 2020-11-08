import React from 'react'
import styles from './Card.module.css'

export default class Card extends React.Component {

  render() {

    const {children, title, customRef} = this.props;

    return (
      <div ref={customRef} className={`${styles.Card} ${title ? styles.Cols : ''}`}>

        { title && this.renderTitle(title) }
        { children }

      </div>
    )

  }

  renderTitle(title) {

    return (
      <div className={styles.Title}>
        <span>{title}</span>
      </div>
    )

  }

}