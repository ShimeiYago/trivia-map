import React from 'react';
import {
  GetSpecialMapPreviewResponse,
  getSpecialMaps,
  GetSpecialMapsResponseWithPagination,
} from 'api/special-map-api/get-special-maps';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { Box, Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { PAGE_NAMES } from 'constant/page-names';
import { CenterPagination } from 'views/components/atoms/center-pagination';
import notImage from 'images/no-image-16x7.jpg';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { cardStyle } from 'views/common-styles/card';
import cardClasses from 'views/common-styles/preview-card.module.css';
import {
  SPECIAL_MAP_LIST_PAGE_LINK,
  SPECIAL_MAP_NEW_PAGE_LINK,
  SPECIAL_MAP_PAGE_LINK,
} from 'constant/links';
import { Link } from 'react-router-dom';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';
import { ApiError } from 'api/utils/handle-axios-error';
import { getUrlParameters } from 'utils/get-url-parameters';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { MyIcon } from 'views/components/atoms/my-icon';

export class Renderer extends React.Component<Props, State> {
  topRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };

    this.topRef = React.createRef();
  }

  componentDidMount(): void {
    this.fetchSpecialMaps(this.props.initialPage);
  }

  render() {
    return (
      <ArticleWrapper showSidebar hideLocalNavi>
        <Typography component="h2" variant="h4" align="center" sx={{ mt: 3, mb: 4 }}>
          <IconAndText
            iconComponent={<MyIcon variant="special-map" fontSize="inherit" />}
            text={PAGE_NAMES.specialMap}
            iconPosition="left"
            variant="inherit"
          />
        </Typography>

        <Typography align="center" my={3}>
          <NonStyleLink to={SPECIAL_MAP_NEW_PAGE_LINK}>
            <Button color="error" variant="contained">
              新しいオリジナルマップを作成する
            </Button>
          </NonStyleLink>
        </Typography>

        {this.renderSpecialMapList()}
      </ArticleWrapper>
    );
  }

  protected renderSpecialMapList = () => {
    const { specialMapsResponseWithPagination } = this.state;

    if (!specialMapsResponseWithPagination) {
      return <CenterSpinner />;
    }

    if (specialMapsResponseWithPagination.results.length === 0) {
      return <Typography align="center">表示する投稿がありません。</Typography>;
    }

    return (
      <>
        <div ref={this.topRef}></div>
        <Stack spacing={3}>
          {this.renderPagination(specialMapsResponseWithPagination)}

          <>
            {specialMapsResponseWithPagination.results.map((specialMap) => {
              return this.renderLargeCard(specialMap);
            })}
          </>

          {this.renderPagination(specialMapsResponseWithPagination)}
        </Stack>
      </>
    );
  };

  protected renderLargeCard = (specialMap: GetSpecialMapPreviewResponse) => {
    const { specialMapId, title, thumbnail, description } = specialMap;

    return (
      <Box key={`special-map-preview-${specialMapId}`}>
        <Link
          to={SPECIAL_MAP_PAGE_LINK(String(specialMapId))}
          className={cardClasses['preview-link']}
        >
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              className={cardClasses['card-media']}
              image={thumbnail ?? notImage}
            />
            <CardContent>
              <DynamicAlignedText
                gutterBottom
                variant="h5"
                component="h3"
                sx={{ wordBreak: 'break-all' }}
              >
                {title}
              </DynamicAlignedText>

              <DynamicAlignedText whiteSpace="pre-wrap">{description}</DynamicAlignedText>

              <Typography align="center" component="div" sx={{ mt: 2 }}>
                <IconAndText
                  iconComponent={<ArrowRightIcon />}
                  text="くわしく読む"
                  component="span"
                  iconPosition="left"
                />
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Box>
    );
  };

  protected renderPagination = (
    specialMapsResponseWithPagination: GetSpecialMapsResponseWithPagination,
  ) => {
    return (
      <CenterPagination
        count={specialMapsResponseWithPagination.totalPages}
        page={specialMapsResponseWithPagination.currentPage}
        onChange={this.handleChangePagination}
        size="large"
      />
    );
  };

  protected fetchSpecialMaps = async (page?: number) => {
    this.setState({
      loading: true,
    });

    try {
      const res = await getSpecialMaps({ page });
      this.setState({
        loading: false,
        specialMapsResponseWithPagination: res,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  };

  protected handleChangePagination = (event: React.ChangeEvent<unknown>, page: number) => {
    this.fetchSpecialMaps(page);
    this.topRef.current && this.topRef.current.scrollIntoView({ block: 'center' });

    const urlParameters = getUrlParameters({
      page,
    });
    history.replaceState('', '', `${SPECIAL_MAP_LIST_PAGE_LINK}${urlParameters}`);
  };
}

export type Props = {
  isMobile: boolean;
  initialPage?: number;

  navigate: (to: string) => void;
  throwError: (errorStatus: number) => void;
};

export type State = {
  loading: boolean;
  specialMapsResponseWithPagination?: GetSpecialMapsResponseWithPagination;
};
