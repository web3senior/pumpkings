import React from 'react'
import Logo from './../../../src/assets/logo.svg'
import styles from './Loading.module.scss'

const Loading = () => (
  <div className={styles['loading']}>
    <div className={`${styles['loading__container']} d-f-c flex-column`}>
      <figure>
        <img alt={import.meta.env.VITE_TITLE} src={Logo} />
      </figure>
      <div />
    </div>
  </div>
)

export default Loading
