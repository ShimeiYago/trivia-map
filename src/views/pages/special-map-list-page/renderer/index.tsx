import React from 'react';
import {
  getSpecialMaps,
  GetSpecialMapsResponseWithPagination,
} from 'api/special-map-api/get-special-maps';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import StarIcon from '@mui/icons-material/Star';
import { PAGE_NAMES } from 'constant/page-names';
import { CenterPagination } from 'views/components/atoms/center-pagination';
import notImage from 'images/no-image-16x7.jpg';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { cardStyle } from 'views/common-styles/card';
import cardClasses from 'views/common-styles/preview-card.module.css';
import { SPECIAL_MAP_PAGE_LINK } from 'constant/links';
import { Link } from 'react-router-dom';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';
import { GetSpecialMapResponse } from 'api/special-map-api/get-special-map';

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
    this.fetchSpecialMaps();
  }

  render() {
    return (
      <ArticleWrapper showSidebar hideLocalNavi>
        <Typography component="h2" variant="h4" align="center" sx={{ mt: 3, mb: 4 }}>
          <IconAndText
            iconComponent={<StarIcon fontSize="inherit" />}
            text={PAGE_NAMES.specialMap}
            iconPosition="left"
            variant="inherit"
          />
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

  protected renderLargeCard = (specialMap: GetSpecialMapResponse) => {
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
      this.props.throwError(500);
    }
  };

  protected handleChangePagination = (event: React.ChangeEvent<unknown>, page: number) => {
    this.fetchSpecialMaps(page);
    this.topRef.current && this.topRef.current.scrollIntoView({ block: 'center' });
  };
}

export type Props = {
  isMobile: boolean;

  navigate: (to: string) => void;
  throwError: (errorStatus: number) => void;
};

export type State = {
  loading: boolean;
  specialMapsResponseWithPagination?: GetSpecialMapsResponseWithPagination;
};
