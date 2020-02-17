import { observable, runInAction, decorate } from "mobx";
import api from "./api";

class Store {
  constructor() {
    this.api = new api();
  }
  @observable Data = {
    model: []
  };
  @observable status = "initial";
  @observable searchQuery = "";

  get = async (url, params) => {
    try {
      const data = await this.api.get(url, params);
      runInAction(() => {
        console.log("DDAATAA:", data);
        this.Data = data;
      });
    } catch (error) {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  post = async (url, params) => {
    try {
      const response = await this.api.post(url, params);
      if (response.status === 201) {
        runInAction(() => {
          this.status = "success";
        });
      }
    } catch (error) {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  update = async (url, params) => {
    try {
      const response = await this.api.put(url, params);
      if (response.status === 200) {
        runInAction(() => {
          this.status = "success";
        });
      }
    } catch (error) {
      runInAction(() => {
        this.status = "error";
      });
    }
  };
  delete = async (url, id) => {
    try {
      const response = await this.api.delete(url, id);
      if (response.status === 204) {
        runInAction(() => {
          this.status = "success";
        });
      }
    } catch (error) {
      runInAction(() => {
        this.status = "error";
      });
    }
  };
}
/*
decorate(Store, {
  Data: observable,
  searchQuery: observable,
  status: observable
});
*/

export default Store;

/*
const StoreContext = React.createContext();

const APIProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    get: store.getAsync,
    data: store.data,
    status: store.status,
    post:  store.postAsync,
    addBug: bug => {
      store.bugs.push(bug);
    },
    get dataCount() {
      return store.data.length;
    }
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <App/>
    </StoreProvider>
  );
};
*/
