import apiRequest from "./apirequest.js";
export class Post {
  /* data is the post data from the API. */
  constructor(data) {
    /* Technically we don't have a full User object here (no followers list), but this is still useful. */
    this.user = new User(data.user);
    this.time = new Date(data.time);
    this.text = data.text;
  }
}
export default class User {
  static async listUsers() {
    let data = await apiRequest("GET", "/users");
    return data.users;
  }

  static async loadOrCreate(id) {
    let data = await apiRequest("GET", `/users/${id}`);
    if (data) {
      return new User(data);
    } else {
      // Nếu người dùng không tồn tại, tạo mới
      let newData = await apiRequest("POST", "/users", { id: id });
      return new User(newData);
    }
  }

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarURL;
    // Khởi tạo các thuộc tính khác từ dữ liệu API nếu cần
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return {
      name: this.name,
      avatarURL: this.avatarURL
      // Thêm các thuộc tính khác cần gửi về server nếu có
    };
  }

  async save() {
    await apiRequest("PUT", `/users/${this.id}`, this.toJSON());
  }

  async getFeed() {
    let data = await apiRequest("GET", `/users/${this.id}/feed`);
    return data.posts.map((postData) => new Post(postData));
  }

  async makePost(text) {
    await apiRequest("POST", `/users/${this.id}/posts`, { text: text });
  }

  async addFollow(id) {
    await apiRequest("POST", `/users/${this.id}/follow?target=${id}`);
  }

  async deleteFollow(id) {
    await apiRequest("DELETE", `/users/${this.id}/follow?target=${id}`);
  }
}
