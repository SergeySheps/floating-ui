import type {MutableRefObject} from 'react';

import type {ContextData} from '../../types';

const DEFAULT_RECT = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

interface Coordinates {
  x: number | null;
  y: number | null;
}

const calculateOffsets = (
  domRect: DOMRect | typeof DEFAULT_RECT,
  clientClickCoordinates: Coordinates,
) => {
  let offsetX = 0;
  let offsetY = 0;

  if (clientClickCoordinates.x) {
    offsetX = domRect.x - clientClickCoordinates.x;
  }

  if (clientClickCoordinates.y) {
    offsetY = domRect.y - clientClickCoordinates.y;
  }

  return {offsetX, offsetY};
};

interface AdjustedCoordinatesParams {
  domRect: DOMRect | typeof DEFAULT_RECT;
  clientClickCoordinates: Coordinates;
}

const getAdjustedCoordinates = ({
  domRect,
  clientClickCoordinates,
}: AdjustedCoordinatesParams) => {
  const {offsetX, offsetY} = calculateOffsets(domRect, clientClickCoordinates);

  return {
    x: domRect.x - offsetX,
    y: domRect.y - offsetY,
  };
};

interface VirtualElementData extends Coordinates {
  dataRef: MutableRefObject<ContextData>;
}

const createRightClickVirtualElement = (
  domElement: Element | null | undefined,
  data: VirtualElementData,
) => {
  return {
    contextElement: domElement || undefined,
    getBoundingClientRect() {
      const domRect = domElement?.getBoundingClientRect() || DEFAULT_RECT;

      const {x, y} = getAdjustedCoordinates({
        domRect,
        clientClickCoordinates: {x: data.x, y: data.y},
      });

      return {
        width: 0,
        height: 0,
        x,
        y,
        top: y,
        left: x,
        right: x,
        bottom: y,
      };
    },
  };
};

export default createRightClickVirtualElement;
