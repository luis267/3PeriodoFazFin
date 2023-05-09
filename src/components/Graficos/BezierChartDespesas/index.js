import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { AuthContext } from "../../../contexts/auth";
import { useContext } from "react";
const screenWidth = Dimensions.get("screen").width;
function BezierChartDespesas() {
  const { listaAli } = useContext(AuthContext);
  const despesasPorMesFaz = {
    0: 0, //Janeiro
    1: 0, //Fevereiro
    2: 0, //Marco
    3: 0, //Abril
    4: 0, //Maio
    5: 0, //Junho
    6: 0, //Julho
    7: 0, //Agosto
    8: 0, //Setembro
    9: 0, //Outubro
    10: 0, //Novembro
    11: 0, //Dezembro
  };
  function getNomeDoMes(mes) {
    const meses = {
      0: "Jan",
      1: "Fev",
      2: "Mar",
      3: "Abr",
      4: "Mai",
      5: "Jun",
      6: "Jul",
      7: "Ago",
      8: "Set",
      9: "Out",
      10: "Nov",
      11: "Dez",
    };
    return meses[mes];
  }

  //Percorre todos as despesas
  listaAli.forEach((item) => {
    const valor = (item.valorAli / item.qtdAli) * item.consumoAli;
    const mes = item.createdAt.getMonth(); // cria uma variavel que se iguala ao mes de criação do item

    despesasPorMesFaz[mes] += valor; //Soma todos as despesas do mês
  });

  //Pega todos os os valores por mês e joga no array (valores)
  const valores = [];
  for (let i = 0; i < 12; i++) {
    valores.push(despesasPorMesFaz[i]);
  }

  const data = {
    labels: Object.keys(despesasPorMesFaz) //pega as chaves do objeto (despesasPorMesFaz)
      .map((mes) => getNomeDoMes(parseInt(mes))), //retorna o nome do mês referente a chave do (despesasPorMesFaz)
    datasets: [
      {
        data: Object.values(despesasPorMesFaz),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      },
    ],
  };
  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
  };
  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={330}
      chartConfig={chartConfig}
      verticalLabelRotation={60}
      fromZero={true}
      bezier
    />
  );
}
export default BezierChartDespesas;
