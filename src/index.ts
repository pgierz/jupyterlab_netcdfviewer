import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/netcdf';


/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'jp-OutputWidgetnetcdf';
import * as NetCDF from 'netcdfjs'


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
    let data = model.data[MIME_TYPE] as string;
    const ArrBuf = Private.b64toArrayBuffer(data);
    let reader = new NetCDF(ArrBuf);
    let ncvarnames = [];
    for (var i = 0; i < reader.variables.length; i++) {
      ncvarnames.push(reader.variables[i].name);
    }
    let ncvarnames_str = ncvarnames.join(" ");
    this.node.textContent = "The file has the following variables: "+ncvarnames_str;
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

namespace Private {
  export
  function b64toArrayBuffer(b64Data: string): ArrayBuffer {
    const byteCharacters = atob(b64Data);
    let len = byteCharacters.length;
    var array = new Uint8Array(new ArrayBuffer(len));
    for (var i = 0; i < len; i++) {
      array[i] = byteCharacters.charCodeAt(i);
    }
    return array;
  }
}
