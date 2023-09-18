import cities from "src/cities";

export default function useGetCityForUf() {
  function getCity(UF) {
    return cities.estados.find((state) => state.sigla === UF).cidades;
  }
  function findUF(UF){
    return {
        nome:cities.estados.find((state) => state.sigla === UF).nome,
        sigle:cities.estados.find((state) => state.sigla === UF).sigla
    }
  }

  return { getCity,findUF };
}
