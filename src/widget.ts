// Dr. Paul Gierz

// Import the netcdfjs library:
import * as NetCDF from 'netcdfjs'

// PG: What does these do?
import {
  ActivityMonitor, PathExt
} from '@jupyterlab/coreutils'

import {
  ABCWidgetFactory, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  DataGrid, JSONModel
} from '@phosphor/datagrid';

import {
  Message
} from '@phosphor/messaging';

import {
  PanelLayout, Widget
} from '@phosphor/widgets';
// PG: End...find out what these packages are for!

// PG: This guy sets up the toolbar to select the delimiter. I don't need that.
// NOTE: I probably need to rewrite this for my own purposes...
/*
import {
  CSVToolbar
} from './toolbar';
*/

// PG: The next section seems to name some classes. I'll just replace CSV with
// NetCDF

// Class name added for the NetCDF viewer
const NetCDF_CLASS = 'jp-NetCDFViewer';

// Class name added for the NetCDF viewer toolbar
const NetCDF_VIEWER_CLASS = 'jp-NetCDFViewer-toolbar';

// Class name for NetCDF viewer DataGrid
const NetCDF_GRID_CLASS = 'jp-NetCDF-grid';

// Timeout definition:
const RENDER_TIMEOUT = 1000;

// Construct the NetCDF viewer

// PG: OK, this looks like it's the "meat" (or, for our vegan friends, the
// "tofu") of the widget...

// Here, I assume we are creating a class, NetCDFViewer, which inherits things
// from Widget. I don't yet know what the implements does...

// Methods I still need to define:
// [ ] _onPathChanged
// [ ] _updateGrid
// [ ] _ready
export
class NetCDFViewer extends Widget implements DocumentRegistry.IReadyWidget {
    constructor(options: NetCDFViewer.IOptions) {
      super();

      let context = this._context = options.context;
      let layout = this.layout = new PanelLayout();

      this.addClass(NetCDF_CLASS);

      this._grid = new DataGrid();
      this._grid.addClass(NetCDF_GRID_CLASS);
      this._grid.headerVisibility = 'column';

      // The next section in the CSV reader deals with the delimiter. I don't
      // really need this here, since NetCDF doesn't have delimiters in this
      // sense...

      context.pathChanged.connect(this._onPathChanged, this);
      this._onPathChanged();

      this._context.ready.then(() => {
        this._updateGrid();
        this._ready.resolve(undefined);
        this._monitor = new ActivityMonitor({
          signal: context.model.contentChanged,
          timeout: RENDER_TIMEOUT
        });
        this._monitor.activityStopped.connect(this._updateGrid, this);
      });
    }

    /**   I'm currently just copy/pasting from the csv reader, I'll try to
    * understand what's happening once I have something that appears to work
    */

    get context(): DocumentRegistry.Context {
      return this._context;
    }

    get ready() {
      return this._ready.promise;
    }

    dispose(): void {
      if (this._monitor) {
        this._monitor.dispose();
      }
      super.dispose();
    }

    /**
    * Handle `'activate-request'` messages.
    * PG: What's this for?
    */
    protected onActivateRequest(msg: Message): void {
      this.node.tabIndex = -1;
      this.node.focus();
    }

    /**
    *
    * Here, the csv version chaneges the delimiter and updates the grid. I don't
    * need that...
    */

    /**
    * Handle a change in the path
    */
    private _onPathChanged(): void {
      this.title.label = PathExt.basename(this._context.localPath);
    }

    // OK this next one I can't copy and pase, since its the model for the grid.
    // In a CSV file, we just have columns and rows. For NetCDF, it's a bit more
    // complicated.

    private _updateGrid(): void{
      console.log("This does nothing yet...");
      console.log("Here, you will need to use the Private namespace defined below")
    }

    private _context: DocumentRegistry.Context;
    private _grid: DataGrid;
    private _monitor: ActivityMonitor<any, any> | null = null;
    private _ready = new PromiseDelegate<void>();
}

/**
* A namespace for `NetCDFViewer` statics
*/
export
namespace NetCDFViewer {
  export
  interface IOptions {
      context: DocumentRegistry.Context;
  }
}

/**
* A widget factory for NetCDF widgets.
*/

export
class NetCDFViewerFactory extends ABCWidgetFactory<NetCDFViewer, DocumentRegistry.IModel> {
  // Create a new widget given a Context
  protected createNewWidget(context: DocumentRegistry.Context): NetCDFViewer {
    return new NetCDFViewer({ context });
  }
}

namespace Private {
  /**
  * This namespace will have some netcdf stuff in it later
  */
}
