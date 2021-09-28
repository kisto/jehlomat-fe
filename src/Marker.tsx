import React, { createContext, ReactNode, useContext, useEffect } from 'react';
export const MarkerLayerContext = createContext(null)

interface MarkerLayerProps {
    id: number,
    map: any,
    coor: {lat:number, lng: number}
}

const MarkerLayer = (props: MarkerLayerProps) => {
    const markerLayer = props.map;
    useEffect(() => {
        console.log(props.map)
        //const markerLayer = props.map;
        var mark = new window.SMap.Marker(window.SMap.Coords.fromWGS84(props.coor.lng, props.coor.lng), props.id);
        console.log("mark", mark);
        mark.decorate(window.SMap.Marker.Feature.Draggable);
        markerLayer.addMarker(mark);
        return () => {
            markerLayer.removeMarker(mark)
        };
    })

    return <MarkerLayerContext.Provider value={markerLayer}></MarkerLayerContext.Provider>;
}

export default MarkerLayer;