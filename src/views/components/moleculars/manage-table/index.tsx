/* istanbul ignore file */

import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PaginationResponse } from 'api/types/pagination-response';
import { CenterPagination } from 'views/components/atoms/center-pagination';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import FolderIcon from '@mui/icons-material/Folder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { useEffect, useState } from 'react';
import { Image } from 'views/components/moleculars/image';
import { DeleteConfirmDialog } from '../delete-confirm-dialog';

export function ManageTable(props: Props) {
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>();

  useEffect(() => {
    if (!props.deleting) {
      setDeleteDialog(undefined);
    }
  }, [props.deleting]);

  return (
    <Stack spacing={1}>
      {renderPagination()}
      {props.isMobile ? renderMobileTable() : renderDesktopTable()}
      {renderPagination()}

      {renderDeleteConfirmDialog()}
    </Stack>
  );

  function renderPagination() {
    const { totalPages, totalRecords, currentPage, startIndex, endIndex } = props.pagination;

    const showPagination = totalPages <= 1 ? false : true;

    return (
      <Stack spacing={1}>
        <Typography align="center" fontSize={14} component="div">
          {startIndex}〜{endIndex}件 / 全{totalRecords}件
        </Typography>

        {showPagination && (
          <CenterPagination
            count={totalPages}
            page={currentPage}
            onChange={props.onChangePagination}
          />
        )}
      </Stack>
    );
  }

  function renderDesktopTable() {
    const tableRows = props.contents.map((content, i) => {
      const { isDraft, onChangeDraftStatus, category, image, numberOfGoods } = content;

      return (
        <TableRow key={`manage-table-row-${i}`}>
          <TableCell>{renderTitleAndButtons(content)}</TableCell>
          {!props.hideCategory && (
            <TableCell width={200}>
              <IconAndText
                iconComponent={<FolderIcon fontSize="inherit" />}
                iconPosition="left"
                text={category ?? ''}
                align="left"
                fontSize={14}
              />
            </TableCell>
          )}
          <TableCell width={70}>
            {onChangeDraftStatus ? (
              <FormControl variant="standard">
                <Select value={String(isDraft)} onChange={onChangeDraftStatus}>
                  <MenuItem value="false">
                    <Typography fontSize={14}>{props.getDraftText(false)}</Typography>
                  </MenuItem>
                  <MenuItem value="true">
                    <Typography fontSize={14}>{props.getDraftText(true)}</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            ) : (
              props.getDraftText(isDraft)
            )}
          </TableCell>
          {!props.hideNumberOfGoods && (
            <TableCell width={40}>
              <IconAndText
                iconComponent={<ThumbUpIcon fontSize="inherit" />}
                iconPosition="left"
                text={String(numberOfGoods)}
                align="left"
              />
            </TableCell>
          )}
          <TableCell>
            {image && <Image src={image} objectFit="cover" width="80px" height="80px" />}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {!props.hideCategory && <TableCell></TableCell>}
            <TableCell></TableCell>
            {!props.hideNumberOfGoods && <TableCell></TableCell>}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  function renderMobileTable() {
    const tableRows = props.contents.map((content, i) => {
      const { isDraft, onChangeDraftStatus, category, image, numberOfGoods } = content;

      return (
        <TableRow key={`manage-table-row-${i}`}>
          <TableCell>
            <Typography color="gray" component="div" marginBottom={1}>
              <Box marginBottom={2}>
                {onChangeDraftStatus ? (
                  <FormControl variant="standard">
                    <Select value={String(isDraft)} onChange={onChangeDraftStatus}>
                      <MenuItem value="false">
                        <Typography variant="subtitle2">{props.getDraftText(false)}</Typography>
                      </MenuItem>
                      <MenuItem value="true">
                        <Typography variant="subtitle2">{props.getDraftText(true)}</Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography fontSize={14}>{props.getDraftText(isDraft)}</Typography>
                )}
              </Box>

              <Stack direction="row" spacing={1} justifyContent="space-between">
                {!props.hideCategory && (
                  <IconAndText
                    iconComponent={<FolderIcon fontSize="inherit" />}
                    iconPosition="left"
                    text={category ?? ''}
                    variant="subtitle2"
                    align="left"
                  />
                )}
                {!props.hideNumberOfGoods && (
                  <IconAndText
                    iconComponent={<ThumbUpIcon fontSize="inherit" />}
                    iconPosition="left"
                    text={String(numberOfGoods)}
                    variant="subtitle2"
                    align="left"
                  />
                )}
              </Stack>
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              {renderTitleAndButtons(content)}
              <Box>
                {image && <Image src={image} objectFit="cover" width="80px" height="80px" />}
              </Box>
            </Stack>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  function renderTitleAndButtons(content: ManageTableContent) {
    const { title, viewLink, editLink, onDelete, onClickEdit } = content;

    return (
      <Box minHeight={80}>
        <Stack minHeight={55} justifyContent="center">
          <Typography component="h3" variant="body1" sx={{ wordBreak: 'break-all' }}>
            {title}
          </Typography>
        </Stack>

        <Box marginBottom={0}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
            <NonStyleLink to={viewLink}>
              <Button sx={{ p: 0, minWidth: 0 }}>表示</Button>
            </NonStyleLink>
            <NonStyleLink to={editLink}>
              <Button sx={{ p: 0, minWidth: 0 }} onClick={onClickEdit}>
                編集
              </Button>
            </NonStyleLink>
            <Button
              onClick={() => setDeleteDialog({ title, onDelete })}
              disabled={props.deleting}
              sx={{ p: 0, minWidth: 0 }}
            >
              削除
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  function renderDeleteConfirmDialog() {
    if (!deleteDialog) {
      return null;
    }

    return (
      <DeleteConfirmDialog
        open
        onClose={() => setDeleteDialog(undefined)}
        deleting={props.deleting}
        title={`「${deleteDialog.title}」を削除しますか？`}
        onDelete={deleteDialog.onDelete}
      />
    );
  }
}

export type Props = {
  isMobile: boolean;
  pagination: Omit<PaginationResponse<unknown>, 'nextUrl' | 'previousUrl' | 'results'>;
  onChangePagination: (event: React.ChangeEvent<unknown>, page: number) => void;
  contents: ManageTableContent[];
  hideCategory?: boolean;
  hideNumberOfGoods?: boolean;
  getDraftText: (isDraft: boolean) => string;
  deleting: boolean;
};

export type ManageTableContent = {
  title: string;
  isDraft: boolean;
  onChangeDraftStatus?: (e: SelectChangeEvent) => void;
  category?: string;
  image: string | null;
  numberOfGoods?: number;
  viewLink: string;
  editLink: string;
  onClickEdit?: () => void;
  onDelete: () => void;
};

type DeleteDialog = {
  title: string;
  onDelete: () => void;
};
