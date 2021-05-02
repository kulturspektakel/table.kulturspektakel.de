import React, {useState, useCallback, CSSProperties} from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export default function useSticky(props: {
  children: (
    ref: React.LegacyRef<HTMLDivElement>,
    style: CSSProperties,
  ) => React.ReactElement;
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [rect, setRect] = useState<DOMRect>();
  const [ref, setRef] = useState<HTMLDivElement | null>();

  const refCb = useCallback(
    (node: HTMLDivElement | null) => {
      console.log('node', node);
      setRef(node);
    },
    [setRef],
  );

  const onChange = useCallback(
    (visible: boolean) => {
      setRect(ref?.getBoundingClientRect());
      setIsSticky(!visible);
    },
    [ref],
  );

  return (
    <VisibilitySensor onChange={onChange}>
      {props.children(
        refCb,
        isSticky
          ? {
              position: 'fixed' as const,
              top: 0,
              left: rect?.left,
              width: rect ? rect.right - rect.left : undefined,
              height: rect?.height,
              zIndex: 2,
              boxShadow: '0 4px 10px var(--chakra-colors-gray-50)',
            }
          : {},
      )}
    </VisibilitySensor>
  );
}
