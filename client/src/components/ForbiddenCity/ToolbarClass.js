/*global Autodesk*/
class ForbiddenCityToolbarExtension extends Autodesk.Viewing.Extension {
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
    var button1 = new Autodesk.Viewing.UI.Button('TexturedHeatMapPlayBack');
    button1.addClass('textured-heatmap-playbutton');
    button1.setToolTip('Playback');

    // Button 2
    var button2 = new Autodesk.Viewing.UI.Button('ShowHideSensors');
    button2.addClass('textured-heatmap-showhide-button');
    button2.setToolTip('Show/Hide Sensors');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('textured-heatmap-toolbar');
    // this.subToolbar.addControl(button1);
    this.subToolbar.addControl(button2);

    toolbar.addControl(this.subToolbar);
  }
}

export default ForbiddenCityToolbarExtension;
