import { getLikedArticlesPreviews } from 'api/likes-api/get-liked-articles-previews';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import {
  Renderer as ArticlePreviewListRenderer,
  Props as ArticlePreviewListProps,
  State as ArticlePreviewListState,
} from '../../article-preview-list/renderer';
import { ApiError } from 'api/utils/handle-axios-error';

export class Renderer extends ArticlePreviewListRenderer {
  protected async fetchArticlesPreviews(page: number) {
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

      this.updatePageParam(page);
    } catch (error) {
      // TODO: 401 handle

      const apiError = error as ApiError<unknown>;

      this.props.throwError(apiError.status);
    }
  }
}

export type Props = ArticlePreviewListProps;
export type State = ArticlePreviewListState;
