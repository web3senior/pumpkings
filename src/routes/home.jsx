import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import Icon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import toast, { Toaster } from 'react-hot-toast'
import Heading from './helper/Heading'
import { useAuth, contracts, getDefaultChain } from './../contexts/AuthContext'
import Logo from './../../src/assets/logo.svg'
import Halloween from './../assets/halloween.svg'
import Bat from './../assets/bat.svg'
import LogoCorner from './../assets/logo-corner.svg'
import Hat from './../assets/hat.png'
import Hand from './../assets/hand.png'
import Candle from './../assets/candle.png'

import CreepyHalloweenSound from './../assets/audio/creepy-halloween-bell-trap-melody-247720.mp3'
import party, { random } from 'party-js'
import styles from './Home.module.scss'
import Web3 from 'web3'

party.resolvableShapes['logo'] = `<img src="${Logo}" style="width:24px"/>`
party.resolvableShapes['hat'] = `<img src="${Hat}" style="width:24px"/>`
party.resolvableShapes['hand'] = `<img src="${Hand}" style="width:24px"/>`
party.resolvableShapes['candle'] = `<img src="${Candle}" style="width:24px"/>`

let played = false

export const loader = async () => {
  return defer({ key: 'val' })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [fee, setFee] = useState()
  const [totalSupply, setTotalSupply] = useState()
  const auth = useAuth()
  const SVG = useRef()
  const navigate = useNavigate()
  const txtSearchRef = useRef()
  const SVGpreview = useRef()
  let selectedElement, offset

  const handleSearch = async () => {
    if (txtSearchRef.current.value.length < 3) {
      toast.error(`A name must be a minimum of 3 characters long.`)
      return
    }

    const t = toast.loading(`Searching`)

    contract.methods
      .toNodehash(txtSearchRef.current.value, selectedRecordType)
      .call()
      .then(async (res) => {
        console.log(res)
        await contract.methods
          ._freeToRegister(res)
          .call()
          .then((res) => {
            console.log(res)
            setFreeToRegister(!res)
            toast.dismiss(t)
          })
      })
  }

  const fetchIPFS = async (CID) => {
    try {
      const response = await fetch(`https://api.universalprofile.cloud/ipfs/${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }

    return false
  }

  const getMintPrice = async () => {
    const web3 = new Web3(getDefaultChain() === `LUKSO` ? window.lukso : window.ethereum)
    const contract = new web3.eth.Contract(contracts[0].abi, contracts[0].contract_address)
    return await contract.methods.fee(`mint_price`).call()
  }

  const rAsset = async (imageURL) => {
    const assetBuffer = await fetch(imageURL).then(async (response) => {
      return response.arrayBuffer().then((buffer) => new Uint8Array(buffer))
    })

    return assetBuffer
  }

  const mint = async (e) => {
    // Add party effect
    party.confetti(document.querySelector(`body`), {
      count: party.variation.range(20, 40),
      size: party.variation.range(0.6, 1.4),
      speed: party.variation.range(0.1, 0.4),
      shapes: ['logo', 'hat', 'candle', 'hand'],
    })

    if (!auth.wallet) {
      auth.connectWallet()
      return
    }

    if (totalSupply >= 58) {
      toast.error(`Maximum Supply!`)
      return
    }

    e.target.innerHTML = 'Please wait...'

    const web3 = new Web3(getDefaultChain() === `LUKSO` ? window.lukso : window.ethereum)
    const t = toast.loading(`Waiting for transaction's confirmation`)

    const nextNFT = totalSupply.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

    try {
      let imageUrl = `https://ipfs.io/ipfs/QmVNhUQUZobqM4jzNqt41MjzwmPQVpuhg1ZAsocNhcbp2J/pumpkings-pfp-${nextNFT}.png`
      console.log(imageUrl)
      let rawMetadata

      if (auth.defaultChain === 'LUKSO') {
        const tConvert = toast.loading(`Generating metadata, takes two minutes...please wait`)
        rAsset(`${imageUrl}`).then((result) => {
          toast.dismiss(tConvert)
          console.log(result)
          console.log(`Verifiable URL`, web3.utils.keccak256(result))
          rawMetadata = web3.utils.toHex({
            LSP4Metadata: {
              name: `PumpKings 🎃`,
              description: `Trick or treat! This NFT is a spooky surprise, full of Halloween fun and festive cheer.`,
              links: [
                { title: 'Website', url: 'https://pumpkings.boo' },
                { title: 'Mint', url: 'https://pumpkings.boo' },
              ],
              attributes: [
                { key: 'Version', value: 1, type: 'number' },
                { key: 'Year', value: 2024, type: 'number' },
                { key: 'Type', value: `PFP`, type: 'string' },
                {
                  key: '🆙',
                  value: true,
                  type: 'boolean',
                },
              ],
              icon: [{ width: 500, height: 500, url: 'ipfs://QmWpSVntG9Mmk9CHczf9ZACKDTuQMVUedEDcCdwwbqBs9b', verification: { method: 'keccak256(bytes)', data: '0xe303725c7fa6e0c8741376085a3859d858eb4d188afa6402bb39d34f40e5ed3f' } }],
              backgroundImage: [
                {
                  width: 1601,
                  height: 401,
                  url: 'ipfs://QmcTYAQmt7ZPbzR6w3XXzGwgfEu4zU2T4LLukqLBvJg2Eg',
                  verification: {
                    method: 'keccak256(bytes)',
                    data: '0x0fd8498ada7a39b1eb9f6ed54adc8950a84d5d79ad8418eb46fbcaf6a5c9638b',
                  },
                },
              ],
              assets: [],
              images: [
                [
                  {
                    width: 1080,
                    height: 1080,
                    url: `${imageUrl}`,
                    verification: {
                      method: 'keccak256(bytes)',
                      data: web3.utils.keccak256(result),
                    },
                  },
                ],
              ],
            },
          })

          // mint
          const contract = new web3.eth.Contract(contracts[0].abi, contracts[0].contract_address)
          contract.methods
            .mint(rawMetadata)
            .send({
              from: auth.wallet,
              value: web3.utils.toWei(fee, `ether`),
            })
            .then((res) => {
              console.log(res) //res.events.tokenId

              // Run partyjs
              party.confetti(document.querySelector(`body`), {
                count: party.variation.range(20, 40),
                shapes: ['logo'],
              })
              e.target.innerHTML = `Mint`
              toast.success(`Transaction has been confirmed! Check out your NFT on UP`)
              toast.dismiss(t)
            })
            .catch((error) => {
              e.target.innerHTML = 'Mint'
              console.log(error)
              toast.dismiss(t)
            })
        })
      }
    } catch (error) {
      console.log(error)
      toast.dismiss(t)
    }
  }
  const getTotalSupply = async () => {
    const web3 = new Web3(getDefaultChain() === `LUKSO` ? window.lukso : window.ethereum)
    const contract = new web3.eth.Contract(contracts[0].abi, contracts[0].contract_address)
    return await contract.methods.totalSupply().call()
  }

  const getFee = async (name) => {
    const web3 = new Web3(getDefaultChain() === `LUKSO` ? window.lukso : window.ethereum)
    const contract = new web3.eth.Contract(contracts[0].abi, contracts[0].contract_address)
    return await contract.methods.fee(name).call()
  }
  const playAudio = () => {
    if (played) return
    // Play background audio
    var audio = new Audio(CreepyHalloweenSound)
    audio.volume = 0.3
    audio.play()
    audio.addEventListener(
      'ended',
      function () {
        this.currentTime = 0

        this.play()
      },
      false
    )
    played = !played
  }
  useEffect(() => {
    const web3 = new Web3()

    getFee(`mint_price`).then((res) => {
      console.log(res)
      setFee(web3.utils.fromWei(web3.utils.toNumber(res), `ether`))
      setIsLoading(false)
    })

    getTotalSupply().then((res) => {
      setTotalSupply(web3.utils.toNumber(res))
      setIsLoading(false)
    })
  }, [])

  return (
    <section className={`${styles.section} ms-motion-slideDownIn d-f-c`} onClick={playAudio}>
      <figure className={`${styles.logo}`}>
        <img src={LogoCorner} />
      </figure>

      <div className={`__container d-f-c`} data-width={`xlarge`}>
        <div className={`${styles.mint} d-f-c flex-column`} id={`mint`}>
          <figure>
            <img src={Bat} />
          </figure>
          <b>Total Supply: {totalSupply && totalSupply}/58</b>
          <b>Mint Price: {fee && fee} $LYX</b>
          <button onClick={(e) => mint(e)}>{!auth.wallet ? `Connect` : `Mint`}</button>
        </div>
      </div>

      <figure className={`${styles['halloween']}`}>
        <img src={Halloween} />
      </figure>
    </section>
  )
}

export default Home
