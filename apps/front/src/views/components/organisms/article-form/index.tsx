import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormDescription,
  selectArticleFormFetchingState,
  selectArticleFormFormError,
  selectArticleFormPosition,
  selectArticleFormSubmittingState,
  selectArticleFormTitle,
  selectArticleFormIsEditting,
  selectArticleFormImage,
  selectArticleFormIsDraft,
  selectArticleFormLastSavedIsDraft,
  selectArticleFormCategory,
  selectArticleFormAreaNames,
} from 'store/article-form/selector';
import {
  fetchArticle,
  initialize,
  submitArticle,
  updateIsEditting,
  updateFormField,
  UpdateFormFieldParam,
} from 'store/article-form/actions';
import { toggleFormModal } from 'store/auths/actions';
import { selectUser } from 'store/auths/selector';
import { throwError } from 'store/global-error/slice';
import { Park } from 'types/park';

export function ArticleForm(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postId: ownProps.postId,
    title: useAppSelector(selectArticleFormTitle),
    description: useAppSelector(selectArticleFormDescription),
    position: useAppSelector(selectArticleFormPosition),
    areaNames: useAppSelector(selectArticleFormAreaNames),
    isDraft: useAppSelector(selectArticleFormIsDraft),
    lastSavedIsDraft: useAppSelector(selectArticleFormLastSavedIsDraft),
    image: useAppSelector(selectArticleFormImage),
    category: useAppSelector(selectArticleFormCategory),
    submittingState: useAppSelector(selectArticleFormSubmittingState),
    fetchingState: useAppSelector(selectArticleFormFetchingState),
    formError: useAppSelector(selectArticleFormFormError),
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    userInfo: useAppSelector(selectUser),
    park: ownProps.park,

    updateFormField: (param: UpdateFormFieldParam) => dispatch(updateFormField(param)),
    submitArticle: () => dispatch(submitArticle()),
    fetchArticle: (postId: number) => dispatch(fetchArticle(postId)),
    initialize: () => dispatch(initialize()),
    handleClickSelectPosition: ownProps.onClickSelectPosition,
    updateIsEditting: (isEditting: boolean) => dispatch(updateIsEditting(isEditting)),
    toggleAuthFormModal: (open: boolean) => dispatch(toggleFormModal(open)),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId?: number;
  park: Park;
  onClickSelectPosition?: () => void;
};
