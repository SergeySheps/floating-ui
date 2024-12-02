import * as React from 'react';

import createRightClickVirtualElement from './utils/createRightClickVirtualElement';
import type {FloatingContext, ElementProps} from '../types';

export interface UseRightClickProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to toggle the open state with repeated clicks.
   * @default true
   */
  toggle?: boolean;
}

export const useRightClick = (
  context: FloatingContext,
  props: UseRightClickProps = {},
) => {
  const {
    open,
    dataRef,
    elements: {domReference},
    refs,
    onOpenChange,
  } = context;
  const {enabled = true, toggle = true} = props;

  const reference: ElementProps['reference'] = React.useMemo(() => {
    return {
      onContextMenu: (event) => {
        event.preventDefault();

        refs.setPositionReference(
          createRightClickVirtualElement(domReference, {
            x: event.clientX,
            y: event.clientY,
            dataRef,
          }),
        );

        if (open && toggle) {
          onOpenChange(false, event.nativeEvent, 'right-click');
        } else {
          onOpenChange(true, event.nativeEvent, 'right-click');
        }
      },
    };
  }, [dataRef, domReference, refs, onOpenChange, open, toggle]);

  return enabled ? {reference} : {};
};
