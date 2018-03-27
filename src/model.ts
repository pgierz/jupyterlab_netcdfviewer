// PG: Here we construct a Model for NetCDF...
// This is going to keep being interesting...

// Import the netcdfjs library:
//import * as NetCDF from 'netcdfjs'

import {
  DataModel
} from '@phosphor/datagrid';

import {
  IDisposable
} from '@phosphor/disposable';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

//import * as NetCDF from 'netcdfjs'

// The Jupyter guys have their own parser here. I might need to do this too..

export
class NetCDFModel_varnames extends DataModel implements IDisposable {
  /**
  * Create a data model with static NetCDF data.
  *
  * @param options - THe options for initializing the data model.
  */
  constructor(options: NetCDFModel.IOptions) {
    super();
    let {
      vars,
    } = options;
    this._data = vars
  }

  // We need something to check if the modle has been disposed (whatever this means)
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  // OK, we need the promise thing
  get ready(): Promise<void> {
    return this._ready.promise;
  }

  // Dispose of the resources
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    // reset some of the variables:
    this._data = null;
  }

  // Implement a columnCount of 1:
  columnCount(region: DataModel.ColumnRegion): number {
    if (region === "body") {
      return 1;
    } else {
      return 0;
    }
  }

  // Get the row count (it's just the length of ncvarnames for now)
  rowCount(region: DataModel.RowRegion): number {
    if (region === "body" ) {
      console.log("rowCount: the length is", this._data.length)
      return this._data.length;
    } else {
      return 1;
    }
  }

  // Implement a data method:
  data(region: DataModel.CellRegion, index: number): string {
    let value: string;
    switch (region) {
      case 'body':
        value = this._data[index]
        break;
      case 'column-header':
        value = "Variable Name";
        break;
      default:
        throw "unreachable";
    }
    return value;
  }

  // data variables:
  private _data: string[];

  // Bookkeeping variables:
  private _isDisposed: boolean = false;
  private _ready = new PromiseDelegate<void>();
}

export
namespace NetCDFModel {
  export
  interface IOptions {
    vars: string[];
  }
}
