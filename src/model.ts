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
    return 1;
  }

  // Get the row count (it's just the length of ncvarnames for now)
  rowCount(region: DataModel.RowRegion): number {
    console.log("rowCount: the length is", this._data.length)
    return this._data.length;
  }

  // Implement a data method:
  data(region: DataModel.CellRegion, index: number): string {
    let value: string;
    value = this._data[index]
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
