import React, {useEffect, useState} from 'react'
import { Box } from '@chakra-ui/react'
import { Map, Marker, PluginConfig, PluginList } from 'react-amap'

import Layout from '../components/layout/Layout'

const mapPlugins: Array<PluginList | PluginConfig> = ['ToolBar', 'Scale']

type Position = {
  lng: number
  lat: number
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

  const [pos, setPos] = useState({lat: 0, lng: 0});
  useEffect(() => {
    if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(p=>{
                setPos({lng: p.coords.longitude, lat: p.coords.latitude});
              },()=>{
                  alert("获取定位失败！");
              }
            );
          }
  });

  // const { account, chainId, library } = useEthers()
  // async function fetchLands() {
  //   if (library) {
  //     const contract = new ethers.Contract(
  //       CONTRACT_ADDRESS,
  //       YourContract.abi,
  //       library
  //     ) as YourContractType
  //     try {
  //       const data = await contract.greeting()
  //       dispatch({ type: 'SET_GREETING', greeting: data })
  //     } catch (err) {
  //       // eslint-disable-next-line no-console
  //       console.log('Error: ', err)
  //     }
  //   }
  // }

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
            <Marker position={{ longitude: 114.122, latitude: 22.627 }} />
            <Marker position={{ longitude: 114.127, latitude: 22.624 }}>
              <div style={styleC}>{1}</div>
            </Marker>
            <Marker position={{ longitude: 114.129, latitude: 22.619 }}>
              <div>{1} MARKER</div>
            </Marker>
          </Map>
        </Box>
      </Box>
    </Layout>
  )
}

export default HomeIndex
