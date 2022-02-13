import React from 'react';
import { Renderer, Props as RendererProps } from './renderer';
import { getRemoteArticle } from 'api/articles-api';

export class Article extends React.Component<Props, State> {
  state: State = {
    title: '',
    content: '',
  };

  async componentDidMount() {
    if (this.props.postId === undefined) {
      return;
    }
    const response = await getRemoteArticle(this.props.postId);
    this.setState({
      title: response.title,
      content: response.content,
    });
  }

  render() {
    const rendererProps: RendererProps = {
      title: this.state.title,
      content: this.state.content,
    };

    return <Renderer {...rendererProps} />;
  }
}

type Props = {
  postId?: string;
};

type State = {
  title: string;
  content: string;
};
