const server = "http://18.190.143.110/api";

class api {
  get = async (url, params) => {
    const apiUrl = `${server}${url}`;
    const options = {
      method: "GET"
    };
    const request = new Request(apiUrl + "?" + params, options);
    const response = await fetch(request);
    return response.json();
  };

  post = async (url, params) => {
    console.log("INPOST:", url, params);
    const headers = new Headers();
    const apiUrl = `${server}${url}`;
    headers.append("Content-Type", "application/json");
    var options = {
      method: "POST",
      headers,
      body: JSON.stringify(params)
    };
    const request = new Request(apiUrl, options);
    return await fetch(request);
    /*
    return new Promise(async (resolve, reject) => {
      try {
        const request = new Request(apiUrl, options);
        const response = await fetch(request);
        console.log("---------", request, response);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
    */
  };

  put = async (url, params) => {
    const headers = new Headers();
    const apiUrl = `${server}${url}`;
    headers.append("Content-Type", "application/json");
    var options = {
      method: "PUT",
      headers,
      body: JSON.stringify(params)
    };
    const request = new Request(apiUrl, options);
    const response = await fetch(request);
    return response;
  };

  delete = async (url, id) => {
    const headers = new Headers();
    const apiUrl = `${server}${url}`;
    headers.append("Content-Type", "application/json");
    const options = {
      method: "DELETE",
      headers
    };
    const request = new Request(apiUrl + "/" + id, options);
    const response = await fetch(request);
    return response;
  };
}

export default api;
