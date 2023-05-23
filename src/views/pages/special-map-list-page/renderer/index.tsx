import React from 'react';
import {
  getSpecialMaps,
  GetSpecialMapsResponseWithPagination,
} from 'api/special-map-api/get-special-maps';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { Stack, Typography } from '@mui/material';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import StarIcon from '@mui/icons-material/Star';
import { PAGE_NAMES } from 'constant/page-names';
import { CenterPagination } from 'views/components/atoms/center-pagination';

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
      <ArticleWrapper showSidebar>
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
              return <div key={`special-map-${specialMap.specialMapId}`}>{specialMap.title}</div>;
            })}
          </>

          {this.renderPagination(specialMapsResponseWithPagination)}
        </Stack>
      </>
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
