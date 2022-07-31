import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { updateUser } from 'store/auths/actions';
import { User } from 'types/user';

export function ProfileEdit() {
  const dispatch = useAppDispatch();

  const props: Props = {
    user: useAppSelector(selectUser),

    updateUser: (user: User) => dispatch(updateUser(user)),
  };

  return <Renderer {...props} />;
}
