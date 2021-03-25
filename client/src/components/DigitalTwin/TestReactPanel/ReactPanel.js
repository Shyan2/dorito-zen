/*global Autodesk*/
import ReactDOM from 'react-dom';
import './ReactPanel.scss';
import React from 'react';
import VideoTest from './VideoTest';

export default class ReactPanel extends Autodesk.Viewing.UI.DockingPanel {
  constructor(viewer, options) {
    super(viewer.container, options.id, options.title, {
      addFooter: false,
      viewer,
    });

    this.state = {
      videoId: options.id,
    };
    this.container.classList.add('react-docking-panel');
    this.DOMContent = document.createElement('div');
    this.DOMContent.className = 'content';
    this.container.appendChild(this.DOMContent);
  }

  initialize() {
    super.initialize();
    this.viewer = this.options.viewer;
    this.footer = this.createFooter();
    this.container.appendChild(this.footer);
  }

  setVisible(show) {
    super.setVisible(show);

    if (show) {
      this.reactNode = ReactDOM.render(<VideoTest id={this.state.videoId} />, this.DOMContent);
    } else if (this.reactNode) {
      ReactDOM.unmountComponentAtNode(this.DOMContent);

      this.reactNode = null;
    }
  }
}
