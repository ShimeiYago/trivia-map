import React, { useEffect } from 'react';

export function AdsenseIns(props: Props) {
  /* istanbul ignore next */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: props.textAlign }}
      data-ad-client={process.env.REACT_APP_AD_CLIENT}
      data-ad-slot={props.adSlot}
      data-ad-format={props.adFormat}
      data-full-width-responsive={props.fullWidthResponsive ? 'true' : undefined}
      data-ad-layout={props.adLayout}
      data-ad-layout-key={props.adLayoutKey}
    ></ins>
  );
}

export type Props = {
  adSlot: string;
  adFormat: 'auto' | 'fluid' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  fullWidthResponsive?: boolean;
  textAlign?: 'center' | 'left' | 'right';
};
