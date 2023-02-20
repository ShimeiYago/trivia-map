import React from 'react';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { MAP_PAGE_LINK, MAP_PAGE_LINK_WITH_CATEGORY, MAP_USER_LINK } from 'constant/links';
import { Box, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { MyIcon } from 'views/components/atoms/my-icon';

export class MapLinkButton extends React.Component<Props> {
  render() {
    let link = MAP_PAGE_LINK;
    if (this.props.userId !== undefined) {
      link = MAP_USER_LINK(String(this.props.userId));
    }
    if (this.props.categoryId !== undefined) {
      link = MAP_PAGE_LINK_WITH_CATEGORY(this.props.categoryId);
    }

    return (
      <Box textAlign="center" color={grey[800]} mt={2} mb={4}>
        <NonStyleLink to={link}>
          <Button color="inherit" variant="outlined" sx={{ py: 2, px: 5 }}>
            <IconAndText
              iconComponent={<MyIcon variant="map-marker" />}
              text="マップ上で確認する"
              iconPosition="left"
              columnGap={1}
            />
          </Button>
        </NonStyleLink>
      </Box>
    );
  }
}

export type Props = {
  userId?: number;
  categoryId?: number;
};
