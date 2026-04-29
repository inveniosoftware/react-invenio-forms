import PropTypes from "prop-types";
import { Button, Icon, Popup } from "semantic-ui-react";
import { FieldLabel } from "../../FieldLabel";

export function RemoveField(props) {
  const { removeFieldCallback, fieldPath, field, label } = props;
  return (
    <>
      <FieldLabel htmlFor={fieldPath} label={label} className="mr-10" />
      <Popup
        content="Remove empty fields from the form"
        trigger={
          <Button icon size="mini" onClick={() => removeFieldCallback(field)}>
            <Icon name="trash alternate outline" />
          </Button>
        }
      />
    </>
  );
}

RemoveField.propTypes = {
  field: PropTypes.object.isRequired,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  removeFieldCallback: PropTypes.func.isRequired,
};
