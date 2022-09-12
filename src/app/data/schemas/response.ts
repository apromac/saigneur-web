export class Response {
  private _status: boolean;
  private _data: any;
  private _message: string;

  constructor(status: boolean, data: any, message: string) {
    this._status = status;
    this._data = data;
    this._message = message;
  }


  get status(): boolean {
    return this._status;
  }

  set status(value: boolean) {
    this._status = value;
  }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
}
