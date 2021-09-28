import './App.css';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useSMap } from "./hooks";
import styled from 'styled-components'
import Marker from './Marker';

const BaseLayers = {
  BASE: 1,
  TURIST: 2,
  OPHOTO: 3,
  HYBRID: 4,
  HISTORIC: 5,
  BIKE: 6,
  TRAIL: 7,
  OPHOTO0203: 8,
  OPHOTO0406: 9,
  OBLIQUE: 12,
  SMART_BASE: 14,
  SMART_OPHOTO: 15,
  SMART_TURIST: 16,
  RELIEF: 17,
  TURIST_WINTER: 19,
  SMART_WINTER: 20,
  SUMMER: 21,
  SMART_SUMMER: 22,
  GEOGRAPHY: 23,
  OPHOTO1012: 24,
  HYBRID_SPARSE: 25,
  OPHOTO1415: 26,
  BASE_NEW: 27,
  TURIST_NEW: 28,
};

const MapContext = createContext(null)

interface MapProps {
  center: { lat: number, lng: number };
  width?: string;
  height?: string;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  baseLayers?: number[];
  children?: React.ReactNode;
}

// Override PreflightCSS presets
const StyledMap = styled.div`
  img {
    max-width: initial !important;
  }
  `

const Map = (props: MapProps) => {
  const mapNode = useRef(null);
  const [map, setMap] = useState(false);
  const { width, height, children } = props;
  const [isLoading, setLoading] = useState(true);

  function start(e: any) { /* Začátek tažení */
    var node = e.target.getContainer();
    //node[map].style.cursor = "help";
  }

  function stop(e: any) {
    var node = e.target.getContainer();
    //node[markerLayer].style.cursor = "";
    var coords = e.target.getCoords();
    console.log(e.target);
  }



  useEffect(() => {
    if (!map && mapNode) {
      const { zoom, center } = props;
      const centerCoords = window.SMap.Coords.fromWGS84(center.lng, center.lat);
      const sMap = new window.SMap(mapNode.current, centerCoords, zoom);
      const l = sMap.addDefaultLayer(BaseLayers.TURIST_NEW);
      l.enable();

      //console.log(smap);
      const markerLayer = new window.SMap.Layer.Marker();
      sMap?.addLayer(markerLayer);
      markerLayer.enable();

      var signals = sMap.getSignals();
      signals.addListener(window, "marker-drag-stop", stop);
      signals.addListener(window, "marker-drag-start", start);

      setMap(markerLayer);
      return () => {
        sMap.removeLayer(markerLayer)
      };
    }
  }, []);

  return (
    <>
      <div style={{ width, height }} ref={mapNode}>
        {map ?
          <>
            <Marker id={1} map={map} coor={{ lat: 10, lng: 10 }}></Marker>
            <Marker id={2} map={map} coor={{ lat: 9.981, lng: 9.998 }}></Marker>
          </>
          : null}
      </div>
    </>
  );
};

Map.defaultProps = {
  width: '100%',
  height: '300px',
  zoom: 13,
  minZoom: 1,
  maxZoom: 21,
  baseLayers: [BaseLayers.TURIST_NEW],
}

const App = () => {
  const [isLoading, setLoading] = useState(true);
  useSMap(() => setLoading(false))

  if (isLoading) {
    return <div>loading...</div>;
  }

  return <Map center={{ lat: 10, lng: 10 }} width='100%' height='100vh' zoom={13} minZoom={1} maxZoom={21} baseLayers={[BaseLayers.TURIST_NEW]}>
  </Map>
}

export default App;
