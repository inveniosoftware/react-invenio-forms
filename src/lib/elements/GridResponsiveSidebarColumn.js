import React from "react";
import PropTypes from "prop-types";
import { Grid, Sidebar, Button, Segment } from "semantic-ui-react";

export class GridResponsiveSidebarColumn extends React.Component {
  render() {
    const closeSidebarBtnRef = React.createRef();
    const {
      mobile,
      tablet,
      computer,
      widescreen,
      largeScreen,
      width,
      open,
      onHideClick,
      children,
      ariaLabel,
    } = this.props;

    return (
      <>
        <Grid.Column
          as="aside"
          aria-label={ariaLabel}
          mobile={mobile}
          tablet={tablet}
          width={width}
          only="mobile tablet"
        >
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

        <Grid.Column
          as="aside"
          aria-label={ariaLabel}
          width={width}
          only="computer"
          computer={computer}
          largeScreen={largeScreen}
          widescreen={widescreen}
        >
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
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  computer: PropTypes.number,
  largeScreen: PropTypes.number,
  widescreen: PropTypes.number,
  ariaLabel: PropTypes.string,
};

GridResponsiveSidebarColumn.defaultProps = {
  width: undefined,
  mobile: undefined,
  tablet: undefined,
  computer: undefined,
  widescreen: undefined,
  largeScreen: undefined,
  ariaLabel: undefined,
};
