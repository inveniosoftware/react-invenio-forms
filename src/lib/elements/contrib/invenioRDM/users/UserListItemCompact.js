import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image } from "../../../Image";
import { Item, Label } from "semantic-ui-react";

export class UserListItemCompact extends Component {
  render() {
    const { id, user, linkToDetailView } = this.props;
    const name = user.profile.full_name || user.username;
    return (
      <Item className="flex" key={id}>
        <Image src={user.links.avatar} avatar loadFallbackFirst />
        <Item.Content className="ml-10">
          <Item.Header className={!user.description ? "mt-5" : ""}>
            {linkToDetailView ? (
              <a href={linkToDetailView}>
                <b>{name}</b>
              </a>
            ) : (
              <b>{name}</b>
            )}
            {user.type === "group" && <Label className="ml-10">Group</Label>}
            {user.is_current_user && (
              <Label size="tiny" className="primary ml-10">
                You
              </Label>
            )}
          </Item.Header>
          <Item.Meta>
            <div className="truncate-lines-1"> {user.profile.affiliations}</div>
          </Item.Meta>
        </Item.Content>
      </Item>
    );
  }
}

UserListItemCompact.propTypes = {
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  linkToDetailView: PropTypes.string,
};

UserListItemCompact.defaultProps = {
  linkToDetailView: undefined,
};
