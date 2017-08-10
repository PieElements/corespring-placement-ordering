import Main from './main.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import compact from 'lodash/compact';

export default class CorespringOrdering extends HTMLElement {

  constructor() {
    super();
    this.sessionChanged = this.sessionChanged.bind(this);
  }

  render() {
    if (this._model && this._session) {
      var element = React.createElement(Main, {
        model: this._model,
        session: this._session,
        sessionChanged: this.sessionChanged
      });
      ReactDOM.render(element, this);
    }
  }

  sessionChanged() {
    console.log(this._session);
    this.dispatchEvent(new CustomEvent('session-changed', {
      bubbles: true,
      detail: {
        complete: this._session && this._session.value && compact(this._session.value).length === this._model.completeLength
      }
    }))
  }

  set model(newModel) {
    this._model = newModel;
    this.render();
    this.dispatchEvent(new CustomEvent('model-set', {
      bubbles: true,
      detail: {
        complete: false
      }
    }));
  }

  set session(newSession) {
    this._session = newSession;
    this.render();
  }

}