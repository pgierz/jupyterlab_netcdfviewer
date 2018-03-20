import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import {
  Widget
} from '@phosphor/widgets';


/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/netcdf';


/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'jp-OutputWidgetnetcdf';

export * from './widget'

/**
 * A widget for rendering netcdf.
 */
export
class OutputWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
  }

  /**
   * Render netcdf into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    // The next line is what I need to change, somehow...
    this.node.textContent = JSON.stringify(model.data[this._mimeType]);
    return Promise.resolve(void 0);
  }

  private _mimeType: string;
}


/**
 * A mime renderer factory for netcdf data.
 */
export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new OutputWidget(options)
};


const extension: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    id: 'jupyterlab_test:plugin',
    rendererFactory,
    //rank: 0,
    dataType: 'string',
    fileTypes: [{
      name: 'NetCDF',
      displayName: 'NetCDF',
      fileFormat: 'base64',
      mimeTypes: [MIME_TYPE],
      extensions: ['.nc', '.netcdf'] // PG: here, we may need to add more, depending on what sort of netcdf files people have.
    }],
  documentWidgetFactoryOptions: {
    name: 'NetCDF',
    modelName: 'base64',
    primaryFileType: 'NetCDF',
    fileTypes: ['NetCDF'],
    defaultFor: ['NetCDF']
    }
  }
];

export default extension;
