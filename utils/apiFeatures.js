class APIFeatures {
  features = ['page', 'sort', 'limit', 'select', 'txtSearch'];

  constructor(model, reqQuery) {
    this.modelName = model.modelName;
    this.query = model;
    this.reqQuery = reqQuery;

    this.filterQuery = { ...reqQuery };
    this.features.forEach((key) => delete this.filterQuery[key]);
  }

  getQueryObj() {
    this.filter();

    if (this.reqQuery.sort) this.sort();
    if (this.reqQuery.select) this.select();
    if (this.reqQuery.limit) this.limit();
    if (this.reqQuery.page) this.paginate();
    if (this.reqQuery.txtSearch && this.modelName === 'Product') this.search();

    return this.query;
  }

  // field.(eq|ne|gte|gt|lte|lt)=value
  filter() {
    let filterStr = JSON.stringify(this.filterQuery);
    filterStr = filterStr.replace(/\b(eq|ne|gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(filterStr));
  }

  // sort=(-|)field1,(-|)field2
  sort() {
    const fields = this.reqQuery.sort.split(',');
    const sortBy = {};

    fields.forEach((field) => {
      const fieldName = field.startsWith('-') ? field.slice(1) : field;
      const sortOrder = field.startsWith('-') ? -1 : 1;

      sortBy[fieldName] = sortOrder;
    });

    this.query = this.query.sort(sortBy);
  }

  // select=field1,field2
  select() {
    const selected = this.reqQuery.select.split(',').join(' ');

    this.query = this.query.select(selected);
  }

  limit() {
    const limit = this.reqQuery.limit * 1 || 40;
    this.query = this.query.limit(limit);
  }

  // page=value
  paginate() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
  }

  // txtSearch=value
  // valid only with product
  search() {
    const search = this.reqQuery.txtSearch;

    this.query = this.query
      .find({ $text: { $search: search } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } });
  }
}

module.exports = APIFeatures;
