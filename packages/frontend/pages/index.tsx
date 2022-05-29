import React, {useEffect, useState} from 'react'
import Meet from '../artifacts/contracts/Meet.sol/MeetSH.json'
import Multi from '../artifacts/contracts/Multicall.sol/Multicall.json'
import { Box } from '@chakra-ui/react'
import { Map, Marker, PluginConfig, PluginList } from 'react-amap'
import { useAccount, useContract, useSigner } from 'wagmi'

import Layout from '../components/layout/Layout'

const mapPlugins: Array<PluginList | PluginConfig> = ['ToolBar', 'Scale']

const RINKEY_CONTRACT_ADDRESS = '0xb8ec9b6798275FDea556CB0119b815B26Fa52898'
const RINKEY_MULTICALL_ADDRESS = '0x4CD21449502936d660F41717Edee75498c14dea9'

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

  const { data: signer, isError, isLoading } = useSigner();
  const meetContract = useContract({
    addressOrName: RINKEY_CONTRACT_ADDRESS,
    contractInterface: Meet.abi,
    signerOrProvider: signer,
  })

  // const multiContract = useContract({
  //   addressOrName: RINKEY_MULTICALL_ADDRESS,
  //   contractInterface: Multi.abi,
  //   signerOrProvider: signer,
  // })

  const [pos, setPos] = useState({lat: 0, lng: 0});
  const [start, setStart] = useState(0);
  const [count, setCount] = useState(0);
  const [lands, setLands] = useState([]);
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

  useEffect(async () => {
    let start = await meetContract.landStart();
    let count = await meetContract.landCount();
    console.log(start, count);
    // getLands(start, count);
  });

  // async function getLands(start: number, count: number) {
  //   let lands = [];
  //   for (let i = start; i <= count; i++) {
  //     let land = await meetContract.allLands(i)
  //     lands.push(land)
  //   }
  //   console.log(lands)
  //   setLands(lands);
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
            {/* {
              lands && lands.map(
                ({ host, guests, name, url, typ, pos, price }) => (
                  <Marker position={{ longitude: pos.lat, latitude: pos.lng }} />
                )
              )
            } */}
            <Marker position={{ longitude: pos.lng, latitude: pos.lat }}>
              <div style={styleC}>{1}</div>
            </Marker>
          </Map>
        </Box>
      </Box>
    </Layout>
  )
}

export default HomeIndex
