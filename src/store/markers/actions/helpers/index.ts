import { Marker } from '../../model';

/**
 * Concats two marker list.
 *
 * @param origMarkers - The original marker list
 * @param newMarkers - The marker list to add newly
 * @returns Combined marker list
 */
export function concatMarkers(
  origMarkers: Marker[],
  newMarkers: Marker[],
): Marker[] {
  return [...origMarkers, ...newMarkers];
}

/**
 * Add new marker to existing marker list.
 * If a marker with same markerId exists in list, numberOfPublicArticles of the marker is increased.
 *
 * @param origMarkers - The original marker list
 * @param newMarker - The marker to add newly
 * @returns updated marker list
 */
export function pushMarker(origMarkers: Marker[], newMarker: Marker): Marker[] {
  const editableOrigMarker = deepCopyMarkers(origMarkers);

  const sameMarkerIndex = editableOrigMarker.findIndex(
    (marker) => marker.markerId === newMarker.markerId,
  );

  if (sameMarkerIndex === -1) {
    editableOrigMarker.push(newMarker);
  } else {
    editableOrigMarker[sameMarkerIndex].numberOfPublicArticles += 1;
  }
  return editableOrigMarker;
}

/**
 * Delete a marker from existing marker list.
 * If target marker have multiple articles, numberOfPublicArticles of the marker is decreaded.
 *
 * @param origMarkers - The original marker list
 * @param deletingMarkerId - The marker id to delete
 * @returns updated marker list
 */
export function deleteOneMarker(
  origMarkers: Marker[],
  deletingMarkerId: number,
): Marker[] {
  const editableOrigMarker = deepCopyMarkers(origMarkers);

  const sameMarkerIndex = editableOrigMarker.findIndex(
    (marker) => marker.markerId === deletingMarkerId,
  );

  if (sameMarkerIndex === -1) {
    return editableOrigMarker;
  }

  if (editableOrigMarker[sameMarkerIndex].numberOfPublicArticles > 1) {
    editableOrigMarker[sameMarkerIndex].numberOfPublicArticles -= 1;
  } else {
    editableOrigMarker.splice(sameMarkerIndex, 1);
  }
  return editableOrigMarker;
}

function deepCopyMarkers(markers: Marker[]) {
  return markers.map((marker) => {
    return {
      markerId: marker.markerId,
      lat: marker.lat,
      lng: marker.lng,
      park: marker.park,
      numberOfPublicArticles: marker.numberOfPublicArticles,
    };
  });
}
