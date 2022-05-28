import React from 'react'
import { Box } from '@chakra-ui/react'
import { Map, Marker, PluginConfig, PluginList } from 'react-amap'

import Layout from '../components/layout/Layout'

const mapPlugins: Array<PluginList | PluginConfig> = ['ToolBar', 'Scale']

function HomeIndex(): JSX.Element {
  const styleB = {
    background: '#000',
    color: '#fff',
    padding: '5px',
  }
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

  return (
    <Layout>
      <Box width="100vw" height="100vh" position="relative">
        <Box position="absolute" left="0" right="0" top="0" bottom="0">
          <Map
            amapkey={'788e08def03f95c670944fe2c78fa76f'}
            // TODO: Get user location and set map center to it
            zoom={14}
            plugins={mapPlugins}
          >
            <Marker position={{ longitude: 120, latitude: 35 }} />
            <Marker position={{ longitude: 121, latitude: 35 }}>
              A{1}
            </Marker>
            <Marker position={{ longitude: 122, latitude: 35 }}>
              <div style={styleB}>B{1}</div>
            </Marker>
            <Marker position={{ longitude: 120, latitude: 34 }}>
              <div style={styleC}>{1}</div>
            </Marker>
            <Marker position={{ longitude: 121, latitude: 34 }}>
              <div>{1} MARKER</div>
              <div>WITH A LOT OF TEXT IN</div>
              <div>OBVIOUSLY NOT LIKE A MARKER</div>
            </Marker>
          </Map>
        </Box>
      </Box>
    </Layout>
  )
}

export default HomeIndex
