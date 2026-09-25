import { Pagination, PaginationProps } from '@mui/material';
import classes from './index.module.css';

export const CenterPagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  return (
    <div className={classes['pagination-wrapper']}>
      <Pagination siblingCount={0} boundaryCount={1} {...props} />
    </div>
  );
};
