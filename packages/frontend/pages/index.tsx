import React, { useCallback, useEffect, useState } from 'react'
import Meet from '../artifacts/contracts/Meet.sol/MeetSH.json'
import Multi from '../artifacts/contracts/Multicall.sol/Multicall.json'
import { Box } from '@chakra-ui/react'
import { Map, Marker, PluginConfig, PluginList } from 'react-amap'
import { useContract, useProvider, useSigner } from 'wagmi'

import Layout from '../components/layout/Layout'

const mapPlugins: Array<PluginList | PluginConfig> = ['ToolBar', 'Scale']

const RINKEY_CONTRACT_ADDRESS = '0xb8ec9b6798275FDea556CB0119b815B26Fa52898'

enum LandType {
  WORK,
  SHOPING,
  PARK,
  ROAD,
  MEETING,
  SPORT,
  OTHER,
  PLAIN,
  GRASS,
  WATER,
  FOREST,
  MOUNTAIN,
  DESERT,
}

type Position = {
  lat: number
  lng: number
}

type Land = {
  host: string
  guests: string[]
  name: string // name or store
  url: string // your avatar or link
  typ: LandType
  pos: Position
  price: number
}

function HomeIndex(): JSX.Element {
  const styleC = {
    background: `url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '30px',
    height: '40px',
    color: '#000',
    textAlign: 'center',
    lineHeight: '40px',
  } as const

  const { data: signer } = useSigner()
  const provider = useProvider()
  const meetContract = useContract({
    addressOrName: RINKEY_CONTRACT_ADDRESS,
    contractInterface: Meet.abi,
    signerOrProvider: signer ?? provider,
  })

  // const multiContract = useContract({
  //   addressOrName: RINKEY_MULTICALL_ADDRESS,
  //   contractInterface: Multi.abi,
  //   signerOrProvider: signer,
  // })

  const [pos, setPos] = useState({ lat: 22.619, lng: 114.129 })
  const [lands, setLands] = useState<Land[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          // setPos({ lng: p.coords.longitude, lat: p.coords.latitude })
          // setPos({ lat: 114.129, lng: 22.619 })
          setPos({ lat: 22.619, lng: 114.129 })
        },
        () => {
          // alert('获取定位失败！')
        }
      )
    }
  }, [])

  const getLands = useCallback(
    async (start: number, count: number) => {
      const lands = []
      for (let i = start; i <= count; i++) {
        const land = await meetContract.allLands(i)
        lands.push(land)
      }
      setLands(lands)
    },
    [meetContract]
  )

  useEffect(() => {
    if (!meetContract || !provider || !signer) {
      return
    }

    ;(async () => {
      try {
        const start = await meetContract.landStart()
        const count = await meetContract.landCount()
        // console.log(start, count)
        // 获取所有地块
        getLands(start, count)
      } catch (error) {
        console.log('🚀 ~ file: index.tsx ~ line 87 ~ ; ~ error', error)
      }
    })()
  }, [getLands, meetContract, provider, signer])

  // 用户点亮地块，参数是经纬度
  function lightLand() {
    try {
      // For some reason we use inverse latitude and longitude here
      const longitude = Math.round(pos.lat * 1000)
      const latitude = Math.round(pos.lng * 1000)
      meetContract.lightLand([longitude, latitude])
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Layout>
      <Box width="100vw" height="100vh" position="relative">
        <Box position="absolute" left="0" right="0" top="0" bottom="0">
          <Map
            amapkey={'788e08def03f95c670944fe2c78fa76f'}
            center={pos}
            zoom={14}
            plugins={mapPlugins}
          >
            {/* cards index.less */}
            {
              // 如果选中，则在上面显示一个地块信息
              // selected > 0 && (
              // <div class="card">
              //   <div class="avatar"><img src={lands[i].url}></></div>
              //   <div class="card-content">
              //     <div class="card-header">
              //       <p class="card-header-title">{lands[i].name}</p>
              //       <p class="card-header-price">{lands[i].price}</p>
              //     </div>
              //     <div class="card-body">
              //       lands[i].guests.map(
              //         (friend) => (
              //           <p class="card-friends">friend.substr(2,4)</p>
              //         )
              //       )
              //     </div>
              //   </div>
              // </div>
              // )
            }

            {/* 地块显示, onclick如果成功显示卡片 */}
            {!!lands?.length &&
              lands.map(({ name, pos }) => (
                <Marker
                  key={name}
                  position={{
                    longitude: pos.lat / 1000,
                    latitude: pos.lng / 1000,
                  }}
                >
                  {/* <div style={styleC}>{name}</div> */}
                </Marker>
              ))}
            {
              // 查看地图可设置 114.129 22.619, onclick 可打卡 lightLand
            }
            <Marker position={{ latitude: pos.lat, longitude: pos.lng }}>
              <div style={styleC} onClick={lightLand}>
                {1}
              </div>
            </Marker>
          </Map>
        </Box>
      </Box>
    </Layout>
  )
}

export default HomeIndex
