// TODO: This component should be completed without using any type.

import React, { useEffect, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import {
  LatLng,
  LeafletEventHandlerFnMap,
  Map as LeafletMap,
  Marker as MarkerType,
  Icon,
} from 'leaflet';

export const CustomMarker = React.forwardRef((props: Props, ref) => {
  const { position, icon, draggable, eventHandlers, popup, autoOpen, map } =
    props;

  const [refReady, setRefReady] = useState(false);
  let popupRef = useRef();

  useEffect(() => {
    if (refReady && autoOpen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).openPopup(popupRef, position);
    }
  }, [autoOpen, refReady, map]);

  return (
    <Marker
      position={position}
      icon={icon}
      draggable={draggable}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      eventHandlers={eventHandlers}
    >
      <Popup
        ref={(r) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          popupRef = r as any;
          setRefReady(true);
        }}
      >
        {popup}
      </Popup>
    </Marker>
  );
});

type Props = {
  position: LatLng;
  icon: Icon;
  popup: React.ReactNode;
  autoOpen: boolean;
  map: LeafletMap;
  draggable?: boolean;
  ref: React.RefObject<MarkerType>;
  eventHandlers: LeafletEventHandlerFnMap;
};
