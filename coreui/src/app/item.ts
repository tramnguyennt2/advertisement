export class Item {
  title: string;
  content: string;
  area: string;
  category: string;
  price: number;
  couchdb_id?: string; // ?: maybe has or not

  constructor(title: string,
              content: string,
              area: string,
              category: string,
              price: number, couchdb_id?: string) {
    this.title = title;
    this.content = content;
    this.area = area;
    this.category = category;
    this.price = price;
    if (couchdb_id) {
      this.couchdb_id = couchdb_id;
    }
  }
}
