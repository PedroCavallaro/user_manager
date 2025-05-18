export interface IPagination<T> {
  page: number
  total: number
  totalPages: number
  data: T
}

export class Pagination<T> {
  private _page: number
  private _total: number
  private _totalPages: number
  private _data: T

  constructor() {}

  setData(data: T) {
    this._data = data

    return this
  }

  setPage(page?: number) {
    this._page = page ?? 1

    return this
  }

  setTotal(length: number, limit?: number) {
    this._total = length ?? 10

    this._totalPages = Math.ceil(length / (limit ?? 10))

    return this
  }

  build(): IPagination<T> {
    return {
      data: this._data,
      totalPages: this._totalPages,
      total: this._total,
      page: this._page
    }
  }
}
