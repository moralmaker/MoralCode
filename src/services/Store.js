import api from "./api";

class Store {
  constructor() {
    this.api = new api();
  }
  Data = {
    model: []
  };
  status = "initial";
  searchQuery = "";

  get = async (url, params) => {
    try {
      const data = await this.api.get(url, params);
        console.log("DDAATAA:", data);
        this.Data = data;
    } catch (error) {
        this.status = "error";
    }
  };

  post = async (url, params) => {
    try {
      const response = await this.api.post(url, params);
      if (response.status === 201) {
          this.status = "success";
      }
    } catch (error) {
        this.status = "error";
    }
  };

  update = async (url, params) => {
    try {
      const response = await this.api.put(url, params);
      if (response.status === 200) {
          this.status = "success";
      }
    } catch (error) {
        this.status = "error";
    }
  };
  delete = async (url, id) => {
    try {
      const response = await this.api.delete(url, id);
      if (response.status === 204) {
          this.status = "success";
      }
    } catch (error) {
        this.status = "error";
    }
  };
}

export default Store;


