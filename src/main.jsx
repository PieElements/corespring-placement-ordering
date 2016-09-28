import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var style = require('!style!css!less!./index.less');

import CorespringPlacementOrdering from './corespring-placement-ordering.jsx'

class Main extends React.Component {
  render() {
    console.log("props", this.props);
    return <div>
      <MuiThemeProvider>
        <CorespringPlacementOrdering
          model={this.props.model}
          session={this.props.session}
        >
        </CorespringPlacementOrdering>
      </MuiThemeProvider>
    </div>
  }
}


export default Main;