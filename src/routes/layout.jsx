import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, Link, NavLink, useNavigate, useNavigation, ScrollRestoration } from 'react-router-dom'
import ConnectPopup from './components/ConnectPopup'
import { Toaster } from 'react-hot-toast'
import { useAuth, chain, getDefaultChain } from './../contexts/AuthContext'
import MaterialIcon from './helper/MaterialIcon'
import Icon from './helper/MaterialIcon'
import LogoIcon from './../../src/assets/logo.svg'
import party from 'party-js'
import styles from './Layout.module.scss'

party.resolvableShapes['LogoIcon'] = `<img src="${LogoIcon}" style="width:24px"/>`


export default function Root() {
  const [network, setNetwork] = useState()
  const [isLoading, setIsLoading] = useState()
  const auth = useAuth()

  const showNetworkList = () => document.querySelector(`.${styles['network-list']}`).classList.toggle(`d-none`)

  /**
   * Selected chain
   * @returns
   */
  const SelectedChain = () => {
    const filteredChain = chain.filter((item, i) => item.name === getDefaultChain())
    return <img alt={`${filteredChain[0].name}`} src={`${filteredChain[0].logo}`} title={`${filteredChain[0].name}`} />
  }

  const handleOpenNav = () => {
    document.querySelector('#modal').classList.toggle('open')
    document.querySelector('#modal').classList.toggle('blur')
    document.querySelector('.cover').classList.toggle('showCover')
  }

  useEffect(() => {
  }, [])

  return (
    <>
      <Toaster />
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
