import React from "react";
import PropTypes from "prop-types";
import { Grid, Sidebar, Button, Segment } from "semantic-ui-react";

export class GridResponsiveSidebarColumn extends React.Component {
  render() {
    const closeSidebarBtnRef = React.createRef();
    const { width, open, onHideClick, children } = this.props;

    return (
      <>
        <Grid.Column width={width} only="mobile tablet">
          <Sidebar
            as={Segment}
            animation="overlay"
            visible={open}
            width="wide"
            onHide={onHideClick}
            onShow={() => closeSidebarBtnRef.current.focus()}
          >
            <Button
              basic
              icon="close"
              size="small"
              floated="right"
              onClick={onHideClick}
              aria-label="Close filter"
              ref={closeSidebarBtnRef}
              className="mb-20"
            />

            {children}
          </Sidebar>
        </Grid.Column>

        <Grid.Column width={width} only="computer">
          {children}
        </Grid.Column>
      </>
    );
  }
}

GridResponsiveSidebarColumn.propTypes = {
  width: PropTypes.number,
  open: PropTypes.bool.isRequired,
  onHideClick: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

GridResponsiveSidebarColumn.defaultProps = {
  width: 4,
};
