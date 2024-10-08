import { useAppDispatch, useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectArticleFormId,
  selectArticleFormIsEditting,
  selectArticleFormIsFormChangedFromLastSaved,
  selectArticleFormSubmittingState,
} from 'store/article-form/selector';
import { initialize } from 'store/article-form/actions';

export function CloseFormButton(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postId: useAppSelector(selectArticleFormId),
    isFormChangedFromLastSaved: useAppSelector(selectArticleFormIsFormChangedFromLastSaved),
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    submittingState: useAppSelector(selectArticleFormSubmittingState),
    onClose: ownProps.onClose,
    initialize: () => dispatch(initialize()),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  onClose: () => void;
};
