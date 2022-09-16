import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import { Park } from 'types/park';
import { ARTICLE_LIST_PAGE_LINK } from 'constant/links';
import { getUrlParameters } from 'utils/get-url-parameters';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    formSearchConditions: {},
    currentSearchConditions: {},
  };

  componentDidMount() {
    this.setState({
      formSearchConditions: this.props.initialSearchConditions,
      currentSearchConditions: this.props.initialSearchConditions,
    });
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (
      JSON.stringify(prevState.currentSearchConditions) !==
      JSON.stringify(this.state.currentSearchConditions)
    ) {
      const urlParameters = getUrlParameters(
        this.state.currentSearchConditions,
      );
      history.replaceState('', '', `${ARTICLE_LIST_PAGE_LINK}${urlParameters}`);
    }
  }

  render() {
    return <ArticleWrapper>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return (
      <>
        {this.renderConditionsForm()}
        <Divider sx={{ my: 3 }} />

        <Typography component="h2" variant="h4" align="center" sx={{ my: 2 }}>
          <IconAndText
            iconComponent={<ArticleIcon fontSize="inherit" />}
            text="投稿一覧"
            iconPosition="left"
            variant="inherit"
          />
        </Typography>
        <ArticlePreviewList
          variant="large"
          searchConditions={this.state.currentSearchConditions}
        />
      </>
    );
  };

  protected renderConditionsForm = () => {
    const disabled =
      JSON.stringify(this.state.formSearchConditions) ===
      JSON.stringify(this.state.currentSearchConditions);

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <IconAndText
              iconComponent={<FilterAltIcon />}
              text="絞り込み検索"
              iconPosition="left"
              variant="inherit"
            />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              borderColor: 'gray',
              borderStyle: 'solid',
              borderWidth: 2,
              borderRadius: 3,
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
            <Grid
              container
              columnSpacing={6}
              rowSpacing={2}
              sx={{ mt: 1, mb: 3 }}
            >
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
              <Button onClick={this.handleClickFiltering} disabled={disabled}>
                この条件で絞り込む
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
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
          value={this.state.formSearchConditions.keywords?.join(',')}
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

export type Props = {
  initialSearchConditions: Conditions;
};

export type State = {
  formSearchConditions: Conditions;
  currentSearchConditions: Conditions;
};

export type Conditions = {
  category?: number;
  park?: Park;
  keywords?: string[];
};
