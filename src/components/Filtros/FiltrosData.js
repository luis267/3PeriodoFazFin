import * as React from "react";
import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropFiltrosData from "../Dropdown/DropFiltrosData";
import { AuthContext } from "../../contexts/auth";

function FiltrosData(props) {
  const { listaRecebida } = props; // Recebe a lista que vai ser filtrada
  const { ListaFiltrada, filtroSelec, FiltroSelec } = useContext(AuthContext);
  const [lista, setLista] = useState(listaRecebida);
  const [startDate, setStartDate] = useState(""); //Filtro Intervalo entre datas
  const [textStartDate, setTextStartDate] = useState("Data Inicial"); //Filtro Intervalo entre datas
  const [endDate, setEndDate] = useState(""); //Filtro Intervalo entre datas
  const [textEndDate, setTextEndDate] = useState("Data Final"); //Filtro Intervalo entre datas
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  useEffect(() => {
    ListaFiltrada(lista);
  }, [lista]);

  //Codigo do DateTimePickerModal
  //Data Inicial
  const showStartDatePicker = () => {
    setIsStartDatePickerVisible(true);
  };
  const hideStartDatePicker = () => {
    setIsStartDatePickerVisible(false);
  };
  const handleStartDateConfirm = (dateStart) => {
    let tempDateStart = new Date(dateStart);
    let fDateStart =
      tempDateStart.getDate().toString().padStart(2, "0") +
      "/" +
      (tempDateStart.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      tempDateStart.getFullYear();
    setTextStartDate(fDateStart);
    setStartDate(dateStart);
    hideStartDatePicker();
  };

  //Data Final
  const showEndDatePicker = () => {
    setIsEndDatePickerVisible(true);
  };
  const hideEndDatePicker = () => {
    setIsEndDatePickerVisible(false);
  };
  const handleEndDateConfirm = (dateEnd) => {
    let tempDateEnd = new Date(dateEnd);
    let fDateEnd =
      tempDateEnd.getDate().toString().padStart(2, "0") +
      "/" +
      (tempDateEnd.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      tempDateEnd.getFullYear();
    setTextEndDate(fDateEnd);
    setEndDate(dateEnd);
    hideEndDatePicker();
  };

  useEffect(() => {
    console.log("opa", filtroSelec);
    if (filtroSelec === "1") {
      setLista(listaRecebida);
    } else if (filtroSelec === "2") {
      const listaUltimosSete = listaRecebida.filter((item) => {
        const itemDataDeCriacao = new Date(item.createdAt);
        itemDataDeCriacao.setHours(0, 0, 0, 0);
        const dataHoje = new Date();
        dataHoje.setHours(0, 0, 0, 0);
        const dataSeteDiasAtras = new Date(dataHoje);
        dataSeteDiasAtras.setDate(dataHoje.getDate() - 7);
        console.log(dataHoje);
        return (
          itemDataDeCriacao >= dataSeteDiasAtras &&
          itemDataDeCriacao <= dataHoje
        );
      });
      setLista(listaUltimosSete);
    } else if (filtroSelec === "3") {
      const listaUltimosTrinta = listaRecebida.filter((item) => {
        const itemDataDeCriacao = new Date(item.createdAt);
        itemDataDeCriacao.setHours(0, 0, 0, 0);
        const dataHoje = new Date();
        dataHoje.setHours(0, 0, 0, 0);
        const dataTrintaDiasAtras = new Date(dataHoje);
        dataTrintaDiasAtras.setDate(dataHoje.getDate() - 30);
        return (
          itemDataDeCriacao >= dataTrintaDiasAtras &&
          itemDataDeCriacao <= dataHoje
        );
      });
      setLista(listaUltimosTrinta);
    } else if (filtroSelec === "4") {
      const listaUltimoAno = listaRecebida.filter((item) => {
        const itemDataDeCriacao = new Date(item.createdAt);
        itemDataDeCriacao.setHours(0, 0, 0, 0);
        const dataHoje = new Date();
        dataHoje.setHours(0, 0, 0, 0);
        const dataUltimoAno = new Date(dataHoje.getFullYear() - 1,dataHoje.getMonth(),dataHoje.getDate());
        return (
          itemDataDeCriacao >= dataUltimoAno && itemDataDeCriacao <= dataHoje
        );
      });
      setLista(listaUltimoAno);
    }
  }, [filtroSelec]);

  //Código para retornar uma lista do intevalo selecionado pelo usuário (FILTRO INTERVALO ENTRE DATAS)
  const filtrarIntervalo = () => {
    if (startDate != "" && endDate != "") {
      const listaFiltradaIntervalo = listaRecebida.filter((item) => {
        //pega todos os itens da lista que foi puxada da (listaRecebida)
        const itemDataDeCriacao = new Date(item.createdAt); //cria uma nova data com a data do (createdAt do item) e atribui a variavel itemDataDeCriacao
        const dataInicio = new Date(startDate); //pega a data de inicio escolhida pelo usuario
        dataInicio.setHours(0, 0, 0, 0); //ajusta o horario para 00:00:00 para garantir que a data de inicio seja no começo do dia.
        const dataFim = new Date(endDate); //pega a data final escolhida pelo usuario
        dataFim.setHours(23, 59, 59, 59); //ajusta o horario para 23:59:59 para garantir que a data final sejá no final do dia.
        return (
          itemDataDeCriacao.getTime() >= dataInicio.getTime() &&
          itemDataDeCriacao.getTime() <= dataFim.getTime()
        );
      });
      setLista(listaFiltradaIntervalo);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropFiltrosData />
      {/*Filtro intervalo entre datas*/}
      <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botoes} onPress={showStartDatePicker}>
          <Text style={styles.texto}>{textStartDate}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
        />

        <TouchableOpacity style={styles.botoes} onPress={showEndDatePicker}>
          <Text style={styles.texto}>{textEndDate}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
        />
      </View>

      {/*Filtro data especifica*/}
      <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botoes} onPress={filtrarIntervalo}>
          <Text style={styles.texto}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botoes}
          onPress={() => {
            setStartDate("");
            setEndDate("");
            setTextStartDate("Data Inicial");
            setTextEndDate("Data Final");
            setLista(listaRecebida);
          }}
        >
          <Text style={styles.texto}>Limpar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBotoes: {
    flexDirection: "row",
    padding: 3,
  },
  botoes: {
    flex: 1,
    backgroundColor: "gray",
    borderRadius: 30,
    width: "50%",
    height: 30,
    justifyContent: "center",
  },
  texto: {
    textAlign: "center",
  },
});

export default FiltrosData;
