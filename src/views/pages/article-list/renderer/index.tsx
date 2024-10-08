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
import { ARTICLES_ORDER_OPTIONS, CATEGORIES } from 'constant';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import { Park } from 'types/park';
import { ARTICLE_LIST_PAGE_LINK, NEW_LINK } from 'constant/links';
import { getUrlParameters } from 'utils/get-url-parameters';
import { PreviewListOrder } from 'api/articles-api/get-articles-previews';
import { PAGE_NAMES } from 'constant/page-names';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import recommendImage from 'images/recommend.png';
import { Image } from 'views/components/moleculars/image';
import { PARKS } from 'constant';
export class Renderer extends React.Component<Props, State> {
  headingRef: React.RefObject<HTMLHeadingElement>;

  constructor(props: Props) {
    super(props);
    this.headingRef = React.createRef();

    this.state = {
      formSearchConditions: props.initialSearchConditions,
      currentSearchConditions: props.initialSearchConditions,
      order: props.initialOrder,
      inputtedKeyword: props.initialSearchConditions.keywords?.join(' ') ?? '',
    };
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (
      JSON.stringify(prevState.currentSearchConditions) !==
        JSON.stringify(this.state.currentSearchConditions) ||
      prevState.order !== this.state.order
    ) {
      const urlParameters = getUrlParameters({
        ...this.state.currentSearchConditions,
        order: this.state.order,
      });
      history.replaceState('', '', `${ARTICLE_LIST_PAGE_LINK}${urlParameters}`);
    }
  }

  render() {
    return <ArticleWrapper showSidebar>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return (
      <>
        {this.renderConditionsForm()}
        {this.renderCurrentConditions()}
        <Divider sx={{ my: 3 }} />

        <Typography
          component="h2"
          variant="h4"
          align="center"
          sx={{ mt: 3, mb: 4 }}
          ref={this.headingRef}
        >
          <IconAndText
            iconComponent={<ArticleIcon fontSize="inherit" />}
            text={PAGE_NAMES.articles}
            iconPosition="left"
            variant="inherit"
          />
        </Typography>
        {this.renderOrderSelectBox()}

        <ArticlePreviewList
          variant="large"
          doesKeepPageParamInUrl
          searchConditions={{
            ...this.state.currentSearchConditions,
            order: this.state.order,
          }}
        />

        <Box textAlign="center" mt={8} mb={5}>
          <NonStyleLink to={NEW_LINK}>
            <Image src={recommendImage} width="300px" />
          </NonStyleLink>
        </Box>
      </>
    );
  };

  protected renderConditionsForm = () => {
    const disabledSearchButton =
      JSON.stringify(this.state.formSearchConditions) ===
      JSON.stringify(this.state.currentSearchConditions);

    const disabledClearButton =
      JSON.stringify(this.state.formSearchConditions) === JSON.stringify({}) &&
      JSON.stringify(this.state.currentSearchConditions) === JSON.stringify({});

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <IconAndText
            iconComponent={<FilterAltIcon />}
            text="絞り込み検索"
            iconPosition="left"
            variant="inherit"
            component="p"
          />
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
            <Grid container columnSpacing={6} rowSpacing={2} sx={{ mt: 1, mb: 3 }}>
              <Grid item xs={12} sm={6}>
                {this.renderCategorySelect()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.renderParkSelect()}
              </Grid>
              <Grid item xs={12}>
                {this.renderKeywordSearch()}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={4} textAlign="center">
                <Button onClick={this.handleClearFiltering} disabled={disabledClearButton}>
                  クリア
                </Button>
              </Grid>
              <Grid item xs={8} textAlign="center">
                <Button onClick={this.handleClickFiltering} disabled={disabledSearchButton}>
                  この条件で絞り込む
                </Button>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  protected renderCurrentConditions = () => {
    const { category, park, keywords } = this.state.currentSearchConditions;

    const getCategoryName = (categoryId: number) => {
      return CATEGORIES.find((categoryObj) => {
        return categoryObj.categoryId === categoryId;
      })?.categoryName;
    };

    return (
      <Box mt={2}>
        {category && <Box>カテゴリー：{getCategoryName(category)}</Box>}
        {park && <Box>パーク：{park === PARKS.land ? 'ランド' : 'シー'}</Box>}
        {keywords && (
          <Box>
            キーワード：
            {keywords.join(' ')}
          </Box>
        )}
      </Box>
    );
  };

  protected renderCategorySelect = () => {
    const { formSearchConditions } = this.state;
    const categoryValue =
      formSearchConditions.category !== undefined ? String(formSearchConditions.category) : '';

    const menuItems = CATEGORIES.map((category) => (
      <MenuItem key={`category-${category.categoryId}`} value={category.categoryId.toString()}>
        {category.categoryName}
      </MenuItem>
    ));

    return (
      <FormControl size="small" fullWidth>
        <InputLabel>カテゴリー</InputLabel>
        <Select value={categoryValue} label="カテゴリー" onChange={this.handleChangeCategory}>
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
        category: event.target.value === '' ? undefined : Number(event.target.value),
      },
    });
  };

  protected renderOrderSelectBox = () => {
    const menuItems = ARTICLES_ORDER_OPTIONS.map((orderOption) => (
      <MenuItem key={orderOption.orderKey} value={orderOption.orderKey}>
        {orderOption.orderName}
      </MenuItem>
    ));

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl size="small" variant="standard">
          <Select value={this.state.order} label="表示順" onChange={this.handleChangeOrder}>
            {menuItems}
          </Select>
        </FormControl>
      </Box>
    );
  };

  protected handleChangeOrder = (event: SelectChangeEvent) => {
    this.setState({
      order: event.target.value as PreviewListOrder,
    });
  };

  protected renderParkSelect = () => {
    const { formSearchConditions } = this.state;
    const categoryValue =
      formSearchConditions.park !== undefined ? String(formSearchConditions.park) : '';

    return (
      <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
        <InputLabel>パーク</InputLabel>
        <Select value={categoryValue} label="パーク" onChange={this.handleChangePark}>
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
        park: event.target.value === 'L' ? 'L' : event.target.value === 'S' ? 'S' : undefined,
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
          value={this.state.inputtedKeyword}
        />
      </Box>
    );
  };

  protected handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = event.target.value.split(/[\s,]+/).filter((v) => v);

    this.setState({
      inputtedKeyword: event.target.value,
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
    this.headingRef.current && this.headingRef.current.scrollIntoView({ block: 'center' });
  };

  protected handleClearFiltering = () => {
    this.setState({
      formSearchConditions: {},
      currentSearchConditions: {},
      inputtedKeyword: '',
    });
    this.headingRef.current && this.headingRef.current.scrollIntoView({ block: 'center' });
  };
}

export type Props = {
  initialSearchConditions: Conditions;
  initialOrder: PreviewListOrder;
};

export type State = {
  formSearchConditions: Conditions;
  currentSearchConditions: Conditions;
  order: PreviewListOrder;
  inputtedKeyword: string;
};

export type Conditions = {
  category?: number;
  park?: Park;
  keywords?: string[];
};
