import * as React from "react";
import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BezierChartFaturamentoReb from "../../../components/Graficos/BezierChartFaturamentoReb";
import DateTimePicker from '@react-native-community/datetimepicker';
import { scale, verticalScale } from "react-native-size-matters";
import Modal from "react-native-modal";
import { AuthContext } from "../../../contexts/auth";
function FaturamentoReb() {
  const { precoCFReb, listaAliReb, listaLeiteReb, precoLeiteReb } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [lista, setLista] = useState(listaLeiteReb);

  //Data

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date"); 
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Selecione a Data');
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'IOS');
    setSearchDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate().toString().padStart(2, '0') + '/' + (tempDate.getMonth() + 1).toString().padStart(2, '0') + '/' + tempDate.getFullYear();
    setText(fDate)

    console.log(fDate)
  }

  const showMode = ( currentMode ) => {
    setShow(true);
    setMode(currentMode);
  }



  //teste filtro data
  useEffect(() => {
    if (searchDate === '') {
      setLista(listaLeiteReb);
    } else {
      setLista(
        listaLeiteReb.filter(item => {
          const itemDate = new Date(item.createdAt); // converte a string de data do item para um objeto Date
          const searchDateObj = new Date(searchDate); // converte a string de busca para um objeto Date
          return itemDate.getDate() === searchDateObj.getDate() // verifica se o dia é igual
            && itemDate.getMonth() === searchDateObj.getMonth() // verifica se o mês é igual
            && itemDate.getFullYear() === searchDateObj.getFullYear(); // verifica se o ano é igual
        })
      );
    }
  }, [searchDate]);
  //FIM

  function toggleModal() {
    setModalVisible(!isModalVisible);
  }
  const imgbg1 = "../../../../assets/bg2.jpg";
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.listaDet}>
        <Text style={styles.tituloBotao}>
          {item.createdAt.getDate().toString().padStart(2, 0)}/{(item.createdAt.getMonth() + 1 ).toString().padStart(2, 0)}/{item.createdAt.getFullYear().toString()} - {item.description} - R$ {(item.prodL * item.precoL).toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  };
  function getReceitas() {
    if (typeof precoLeiteReb !== "undefined") {
      return Number(precoLeiteReb);
    } else {
      return 0;
    }
  }
  const receitas = getReceitas();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.imgbg}
        source={require(imgbg1)}
        imageStyle={{ opacity: 0.3 }}
      >
        <TouchableOpacity
          onPress={() => {
            toggleModal();
          }}
        >
          <Text style={styles.texto}>Total de receitas:</Text>
          <Text style={styles.textoValorPos}>R${receitas.toFixed(2)}</Text>
          <View style={styles.lineStyle} />
          <Text style={styles.preGraf}>Clique no gráfico para mais detalhes.</Text>
          <View style={styles.containerChart}>
            <BezierChartFaturamentoReb />
          </View>
          <Modal
            isVisible={isModalVisible}
            coverScreen={true}
            backdropColor={"rgba(234,242,215,0.8)"}
            animationIn="slideInUp"
            animationOut="slideOutDown"
          >
            <View style={styles.modalContainer}>
              <Text style={styles.tituloModal}>Detalhes de receitas:</Text>
              {/*data*/}
              <View style={styles.containerinfos}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{flex: 1, backgroundColor: "gray", borderRadius: 30, width: '50%', height: 30}}
                    onPress={() => showMode('date')}>
                    <Text style={{ textAlign: "center"}}>{text}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{flex: 1, backgroundColor: "#888", borderRadius: 30, width: '50%', height: 30}}
                    onPress={() => {
                      setSearchDate('')
                      setText('Selecione a Data')
                      }
                    }>
                    <Text style={{ textAlign: "center"}}>Limpar</Text>
                  </TouchableOpacity>
                </View>

                { show && ( 
                  <DateTimePicker 
                  testID = "dateTimePicker"
                  value = {date}
                  mode = {mode}
                  display="default"
                  onChange={onChange}
                />)}

                <StatusBar style = "auto" />
              </View>


              <FlatList
                style={styles.scroll}
                data={lista}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />
            </View>
            <TouchableOpacity
              style={styles.botaopressM}
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={styles.tituloBotao}>{"Voltar"}</Text>
            </TouchableOpacity>
          </Modal>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaopress}
          onPress={() => navigation.navigate("GeralReb")}
        >
          <Text style={styles.tituloBotao}>{"Voltar"}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  preGraf:{
    color: 'white',
    alignSelf: 'center',

  },
  modalContainer: {
    backgroundColor: "rgba(234,242,215,1)",
    position: "absolute",
    top: verticalScale(0),
    alignSelf: "center",
    width: scale(330),
    borderRadius: 20,
  },
  modalScroll: {
    height: verticalScale(500),
    marginVertical: verticalScale(10),
  },
  container: {
    backgroundColor: "#006773",
    flex: 1,
  },
  lineStyle: {
    backgroundColor: "#FFF",
    padding: verticalScale(0.4),
    width: scale(310),
    alignSelf: "center",
    margin: verticalScale(6),
  },
  containerChart: {
    position: "absolute",
    top: verticalScale(150),
  },
  botaopress: {
    borderRadius: 20,
    backgroundColor: "rgba(15, 109, 0, 0.9)",
    width: scale(300),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: verticalScale(530),
    position: "absolute",
  },
  tituloBotao: {
    fontSize: verticalScale(14),
    fontWeight: "bold",
    color: "#fff",
  },
  tituloModal: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: "rgba(0, 69, 19, 0.95)",
    margin: verticalScale(5),
    alignSelf: "center",
  },
  imgbg: {
    flex: 1,
    resizeMode: "cover",
    padding: verticalScale(10),
  },
  textoValorNeg: {
    color: "#FF3131",
    fontWeight: "bold",
    fontSize: verticalScale(30),
    marginLeft: scale(20),
  },
  texto: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: verticalScale(25),
    marginLeft: scale(20),
  },
  textoValorPos: {
    color: "#0FFF50",
    fontWeight: "bold",
    fontSize: verticalScale(30),
    marginLeft: scale(20),
  },
  botaopressM: {
    borderRadius: 20,
    backgroundColor: "rgba(15, 109, 0, 0.9)",
    width: scale(300),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: verticalScale(583),
    position: "absolute",
  },
  listaDet: {
    borderRadius: 20,
    backgroundColor: "rgba(15, 109, 0, 0.95)",
    width: scale(300),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: verticalScale(5),
  },
  listaDet2: {
    borderRadius: 20,
    backgroundColor: "rgba(0, 69, 19, 0.95)",
    width: scale(300),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: verticalScale(5),
  },
  scroll: {
    height: verticalScale(525),
  },
});
export default FaturamentoReb;
