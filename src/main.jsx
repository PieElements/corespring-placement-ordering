import { amber300, amber500, amber600, green200, green500 } from 'material-ui/styles/colors';

import CorespringPlacementOrdering from './placement-ordering.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getDnDManager from './dnd-global-context';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./index.less');


class Main extends React.Component {

  //TODO: if we do decide to use the material ui theming - we should move this logic to a library this is a copy of what's in multiple-choice and ordering
  _getMuiTheme(className) {
    if (className === 'white-on-black') {
      return getMuiTheme(darkBaseTheme, {
        correctColor: green200,
        incorrectColor: amber500,
        palette: {
          textColor: 'white'
        }
      });
    } else if (className === 'black-on-rose') {
      return getMuiTheme({
        correctColor: green500,
        incorrectColor: amber600
      });
    } else {
      return getMuiTheme({
        correctColor: green500,
        incorrectColor: amber600
      });
    }
  };

  getChildContext() {
    return {
      dragDropManager: getDnDManager(),
    };
  }

  render() {

    let theme = this._getMuiTheme(this.props.model.className);
    return <div>
      <MuiThemeProvider muiTheme={theme}>
        <CorespringPlacementOrdering
          model={this.props.model}
          session={this.props.session}
          sessionChanged={this.props.sessionChanged}
        >
        </CorespringPlacementOrdering>
      </MuiThemeProvider>
    </div>
  }
}

Main.childContextTypes = {
  dragDropManager: React.PropTypes.object.isRequired
}

export default Main;

