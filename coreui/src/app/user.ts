export class User {
  id?: string;
  email?: string;
  password?: string;
  fullname?: string;
  phone?: string;
  address?: string;
  role: string;
  type: string;

  constructor(id?: string, email?: string, password?: string, fullname?: string, phone?: string, address?: string) {
    if (id) this.id = id;
    if (email) this.email = email;
    if (password) this.password = password;
    if (fullname) this.fullname = fullname;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    this.role = "user";
    this.type = "user";
  }

  setUser(obj) {
    this.id = obj._id;
    this.email = obj.email;
    this.password = obj.password;
    this.fullname = obj.fullname;
    this.phone = obj.phone;
    this.address = obj.address;
    this.role = "user";
    this.type = "user";
  }
}
