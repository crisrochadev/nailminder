import { api } from "src/boot/axios";

export default async function callApi(method, endpoint, body = {}) {
  return await api[method](endpoint, body)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Erro no endpoint ${endpoint} : `, error);
      return error;
    });
}
