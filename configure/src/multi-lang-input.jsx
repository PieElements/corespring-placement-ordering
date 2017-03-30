import React from 'react';
import TextField from 'material-ui/TextField';
import { merge } from 'lodash';

export default class MultiLangInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, update) {
    const { lang, onChange } = this.props;
    onChange(update, lang);
  }

  render() {

    const { lang, value, textFieldLabel, style } = this.props;

    const renderValue = (typeof value === 'string') ?
      value : (value.find(t => t.lang === lang) || {}).value || '';

    return <div className="multi-lang-input" style={style}>
      <TextField
        hintText={this.props.placeholder}
        floatingLabelText={textFieldLabel}
        name={renderValue}
        value={renderValue}
        style={{ flex: 1 }}
        onChange={this.onChange} />
    </div>;
  }
}