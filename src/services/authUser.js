import { api } from "src/boot/axios";

export default async function AuthUser() {
    const token = localStorage.getItem('nail_token')
  const res = await api
    .get("/user", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => res.data)
    .catch((err) => err);
  if (res.data) return res.data;
  else return res;
}
