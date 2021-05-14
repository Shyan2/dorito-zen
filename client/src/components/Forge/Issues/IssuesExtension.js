/*global Autodesk*/
class IssuesExtensionToolbar extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
  }

  load() {
    return true;
  }

  unload() {
    if (this.subToolbar) {
      this.viewer.toolbar.removeControl(this.subToolbar);
      this.subToolbar = null;
    }
  }

  onToolbarCreated(toolbar) {
    // Button 1
    var button1 = new Autodesk.Viewing.UI.Button('CreateNewIssue');
    button1.addClass('create-new-issue-button');
    button1.setToolTip('Create New Issue');

    // Button 2
    var button2 = new Autodesk.Viewing.UI.Button('ShowHideIssues');
    button2.addClass('show-hide-issues-button');
    button2.setToolTip('Show/Hide Issues');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('viewer-issues-toolbar');
    // this.subToolbar.addControl(button1);
    this.subToolbar.addControl(button2);

    toolbar.addControl(this.subToolbar);
  }
}

export default IssuesExtensionToolbar;
