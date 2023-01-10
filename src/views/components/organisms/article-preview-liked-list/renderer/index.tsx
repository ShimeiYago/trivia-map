import { getLikedArticlesPreviews } from 'api/likes-api/get-liked-articles-previews';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import {
  Renderer as ArticlePreviewListRenderer,
  Props as ArticlePreviewListProps,
  State as ArticlePreviewListState,
} from '../../article-preview-list/renderer';

export class Renderer extends ArticlePreviewListRenderer {
  protected async fetchArticlesPreviews(page?: number) {
    this.setState({
      loadingState: 'loading',
      articlesPreviews: undefined,
    });

    try {
      const res = await autoRefreshApiWrapper(
        () =>
          getLikedArticlesPreviews({
            page: page,
          }),
        this.props.refreshUser,
      );

      this.setState({
        loadingState: 'success',
        articlesPreviews: {
          ...res,
          results: res.results.map((result) => {
            return result.article;
          }),
        },
      });
    } catch (error) {
      // TODO: 401 handle
      this.props.throwError(500);
    }
  }
}

export type Props = ArticlePreviewListProps;
export type State = ArticlePreviewListState;
