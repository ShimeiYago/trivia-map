import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LocalBackNavi, Props, Renderer } from './renderer';
import { isMobile } from 'react-device-detect';

export function ArticleWrapper(ownProps: OwnProps) {
  const { pathname } = useLocation();

  const props: Props = {
    isMobile: isMobile,
    children: ownProps.children,
    showSidebar: !!ownProps.showSidebar,
    localBackNavi: ownProps.localBackNavi,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Renderer {...props} />;
}

type OwnProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
  localBackNavi?: LocalBackNavi;
};
