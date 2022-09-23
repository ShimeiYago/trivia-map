import { Props, Renderer } from './renderer';
import { isMobile } from 'react-device-detect';

export function ArticleWrapper(ownProps: OwnProps) {
  const props: Props = {
    isMobile: isMobile,
    children: ownProps.children,
    showSidebar: !!ownProps.showSidebar,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
};
