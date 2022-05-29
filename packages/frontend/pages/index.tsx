import React, {useEffect, useState} from 'react'
import Meet from '../artifacts/contracts/Meet.sol/MeetSH.json'
import Multi from '../artifacts/contracts/Multicall.sol/Multicall.json'
import { Box } from '@chakra-ui/react'
import { Map, Marker, PluginConfig, PluginList } from 'react-amap'
import { useContract, useSigner } from 'wagmi'

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
  const [selected, setSelected] = useState(0);
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
    // 获取所有地块
    // getLands(start, count);
  });

  async function getLands(start: number, count: number) {
    let lands = [];
    for (let i = start; i <= count; i++) {
      let land = await meetContract.allLands(i)
      lands.push(land)
    }
    console.log(lands)
    setLands(lands);
  }

  // 用户点亮地块，参数是经纬度
  function lightLand() {
    try {
      meetContract.lightLand([pos.lat, pos.lng])
    } catch(e) {
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

            {
            // 地块显示, onclick如果成功显示卡片
            /* {
              lands && lands.map(
                ({ host, guests, name, url, typ, pos, price }) => (
                  <Marker position={{ longitude: pos.lat, latitude: pos.lng }} />
                )
              )
            } */}
            {
            // 查看地图可设置 114.129 22.619, onclick 可打卡 lightLand
            }
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
