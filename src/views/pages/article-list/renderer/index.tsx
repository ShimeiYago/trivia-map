import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { CATEGORIES } from 'constant';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    formSearchConditions: {},
    currentSearchConditions: {},
  };

  render() {
    return <ArticleWrapper>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return (
      <>
        {this.renderConditionsForm()}
        <ArticlePreviewList
          variant="large"
          searchConditions={this.state.currentSearchConditions}
        />
      </>
    );
  };

  protected renderConditionsForm = () => {
    return (
      <Box
        sx={{
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: 2,
          borderRadius: 3,
          mb: 3,
          mx: 2,
          p: 2,
        }}
      >
        <Typography component="h2" variant="h6" align="center">
          <IconAndText
            iconComponent={<FilterAltIcon />}
            text="絞り込み条件"
            iconPosition="left"
            variant="inherit"
          />
        </Typography>
        <Grid container columnSpacing={6} rowSpacing={2} sx={{ mt: 1, mb: 3 }}>
          <Grid item xs={12} md={6}>
            {this.renderCategorySelect()}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.renderParkSelect()}
          </Grid>
          <Grid item xs={12}>
            {this.renderKeywordSearch()}
          </Grid>
        </Grid>
        <Box textAlign="center">
          <Button onClick={this.handleClickFiltering}>
            この条件で絞り込む
          </Button>
        </Box>
      </Box>
    );
  };

  protected renderCategorySelect = () => {
    const { formSearchConditions } = this.state;
    const categoryValue =
      formSearchConditions.category !== undefined
        ? String(formSearchConditions.category)
        : '';

    const menuItems = CATEGORIES.map((category) => (
      <MenuItem
        key={`category-${category.categoryId}`}
        value={category.categoryId.toString()}
      >
        {category.categoryName}
      </MenuItem>
    ));

    return (
      <FormControl size="small" fullWidth>
        <InputLabel>カテゴリー</InputLabel>
        <Select
          value={categoryValue}
          label="カテゴリー"
          onChange={this.handleChangeCategory}
        >
          <MenuItem value="">
            <em>未選択</em>
          </MenuItem>
          {menuItems}
        </Select>
      </FormControl>
    );
  };

  protected handleChangeCategory = (event: SelectChangeEvent) => {
    this.setState({
      formSearchConditions: {
        ...this.state.formSearchConditions,
        category:
          event.target.value === '' ? undefined : Number(event.target.value),
      },
    });
  };

  protected renderParkSelect = () => {
    const { formSearchConditions } = this.state;
    const categoryValue =
      formSearchConditions.park !== undefined
        ? String(formSearchConditions.park)
        : '';

    return (
      <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
        <InputLabel>パーク</InputLabel>
        <Select
          value={categoryValue}
          label="パーク"
          onChange={this.handleChangePark}
        >
          <MenuItem value="">
            <em>未選択</em>
          </MenuItem>
          <MenuItem value="L">ランド</MenuItem>
          <MenuItem value="S">シー</MenuItem>
        </Select>
      </FormControl>
    );
  };

  protected handleChangePark = (event: SelectChangeEvent) => {
    this.setState({
      formSearchConditions: {
        ...this.state.formSearchConditions,
        park:
          event.target.value === 'L'
            ? 'L'
            : event.target.value === 'S'
            ? 'S'
            : undefined,
      },
    });
  };

  protected renderKeywordSearch = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          label="キーワード検索"
          variant="standard"
          fullWidth
          onChange={this.handleChangeKeyword}
        />
      </Box>
    );
  };

  protected handleChangeKeyword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const keywords = event.target.value
      .split(/[\s,]+/)
      .filter((keyword) => keyword !== '');

    this.setState({
      formSearchConditions: {
        ...this.state.formSearchConditions,
        keywords: keywords,
      },
    });
  };

  protected handleClickFiltering = () => {
    this.setState({
      currentSearchConditions: this.state.formSearchConditions,
    });
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Props = {};

export type State = {
  formSearchConditions: Conditions;
  currentSearchConditions: Conditions;
};

type Conditions = {
  category?: number;
  park?: 'L' | 'S';
  keywords?: string[];
};
