import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main.jsx';

export default class CorespringOrdering extends HTMLElement {

  render() {
    if (this._model && this._session) {
      var element = React.createElement(Main, {
        model: this._model,
        session: this._session
      });
      ReactDOM.render(element, this);
    }
  }
  
  set model(newModel) {
    this._model = newModel;
    this.render();
  }

  set session(newSession) {
    this._session = newSession;
    this.render();
  }

  connectedCallback() {
    this.dispatchEvent(new CustomEvent('pie.register', { bubbles: true }));
  }
}