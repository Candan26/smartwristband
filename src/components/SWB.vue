<template>
  <div>
    <!--Introduction Division -->
    <div>
      <h1 class="introduction">
        Smart wristband data observation page
      </h1>
      <p>
        This cite is for showing the results of sensor fusion in test environment. For every sensor type please select
        from
        sidebar.
      </p>
      <div class="custom-date">

        <b-dropdown id="dropdown-1" text="Select User" size="sm">
          <b-dropdown-item>
            <font-awesome-icon icon="user" size="1x"></font-awesome-icon>
            Cagri
          </b-dropdown-item>
          <b-dropdown-item>
            <font-awesome-icon icon="user" size="1x"></font-awesome-icon>
            Burak
          </b-dropdown-item>
        </b-dropdown>
        <datetime type="datetime" v-model="datetime1" format="yyyy-MM-dd'T'HH:mm:ss.SSSZ" placeholder="from"></datetime>
        <datetime type="datetime" v-model="datetime2" format="yyyy-MM-dd'T'HH:mm:ss.SSSZ" placeholder="to"></datetime>

      </div>
    </div>
    <!--Raw data imp -->
    <div>
      <h1>Data observation from raw data</h1>

      <a class="btn btn-lg btn-outline-warning" @click="skinResistanceButtonPressed" href="#">
        <font-awesome-icon icon="user-shield" size="3x"/>
        Skin Resistance</a>

      <a class="btn btn-lg btn-outline-success" @click="HRSPO2ButtonPressed" href="#">
        <font-awesome-icon icon="heartbeat" size="3x"/>
        HR & SPO2</a>

      <a class="btn btn-lg btn-outline-primary" @click="ECGRRButtonPressed" href="#">
        <font-awesome-icon icon="signature" size="3x"/>
        ECG & RR</a>

      <a class="btn btn-lg btn-outline-danger" @click="temperatureHumidityButtonPressed" href="#">
        <font-awesome-icon icon="tint" size="3x"/>
        <font-awesome-icon icon="temperature-high" size="3x"/>
        Temp & Humidity</a>

      <b-dropdown text="Select Date(Y/M/D/H/M/S)" class="m-md-2"  >
        <b-dropdown-item v-for="(item, key) in reportData" :key="key" :value="item.text"
                         @click="updateGraphFromDropDown(item.text)" >
          {{ item.text }}
        </b-dropdown-item>
      </b-dropdown>

    </div>
    <b-overlay :show="show" rounded="sm">
      <div id="wrapper">
        <div id="chart-line">
          <apexchart class="lineChartApex" type="line" height="360" :options="chartOptions"
                     :series="series"></apexchart>
        </div>
        <div id="chart-line2">
          <apexchart class="lineChartApex" type="line" height="360" :options="chartOptionsLine2"
                     :series="seriesLine2"></apexchart>
        </div>
      </div>

    </b-overlay>
    <div>

    </div>

  </div>
</template>

<script>
import {getTemperatureHumidityData} from '../js/dao';
import {getHRSPO2Data} from '../js/dao';
import {getECGRRData} from '../js/dao';
import {getSRData} from '../js/dao';

const SR = "SR";
const HR_SPO2 = "HR";
const ECG_RR = "ECG";
const TEMP_HUMIDITY = "TH";

export default {
  name: "SWB",
  data() {
    return {
      show: false,
      datetime1: null,
      datetime2: null,
      apexGraph:
          {
            dataFirst: [],
            dataSecond: []
          }
      ,
      series: [{
        data: []
      }],
      reportData: [{
        text: '',
        value: [],
        valueSecond: [],
      }],
      chartOptions: {
        chart: {
          id: 'fb',
          group: 'social',
          type: 'line',
          height: 160
        },
        colors: ['#008FFB'],
        yaxis: {
          labels: {
            minWidth: 500
          }
        },
      },

      seriesLine2: [{
        data: []
      }],
      chartOptionsLine2: {
        chart: {
          id: 'tw',
          group: 'social',
          type: 'line',
          height: 160
        },
        colors: ['#546E7A'],
        yaxis: {
          labels: {
            minWidth: 500
          }
        }
      },

      seriesArea: [{
        data: []
      }],
      chartOptionsArea: {
        chart: {
          id: 'yt',
          group: 'social',
          type: 'line',
          height: 160
        },
        colors: ['#00E396'],
        yaxis: {
          labels: {
            minWidth: 500
          }
        }
      },

    }
  },
  methods: {
    setDropDownDataAll(array, sensor_type) {
      let innerArray1 = [];
      let innerArray2 = [];
      let firstArray = []
      let secondArray = [];
      for (let i = 0; i < array.length; i++) {
        if (sensor_type === SR) {
          firstArray = array[i].getParsedData();
        } else if (sensor_type === HR_SPO2) {
          firstArray = array[i].getParsedHRData();
          secondArray = array[i].getParsedSPO2Data();
        } else if (sensor_type === ECG_RR) {
          firstArray = array[i].getParsedECGData();
          secondArray = array[i].getParsedRRData();
        } else if (sensor_type === TEMP_HUMIDITY) {
          firstArray = array[i].getParsedTemperatureData();
          secondArray = array[i].getParsedHumidityValueData();
        }

        for (let j = 0; j < firstArray.length; j++)
          innerArray1.push(firstArray[j]);

        for (let j = 0; j < secondArray.length; j++)
          innerArray2.push(secondArray[j]);
      }
      this.reportData.push({text: "all", value: innerArray1, valueSecond: innerArray2});
    },
    setApexGraphData(array, sensor_type) {
      let timeCounter = 0;
      let baseValue = ""
      let firstArray = []
      let secondArray = [];
      for (let i = 0; i < array.length; i++) {
        if (sensor_type === SR) {
          firstArray = array[i].getParsedData();
        } else if (sensor_type === HR_SPO2) {
          firstArray = array[i].getParsedHRData();
          secondArray = array[i].getParsedSPO2Data();
        } else if (sensor_type === ECG_RR) {
          firstArray = array[i].getParsedECGData();
          secondArray = array[i].getParsedRRData();
        } else if (sensor_type === TEMP_HUMIDITY) {
          firstArray = array[i].getParsedTemperatureData();
          secondArray = array[i].getParsedHumidityValueData();
        }
        let date = Date.parse(array[i].date)
        const td = new Date(date);
        baseValue = getBaseValue(td);
        this.reportData.push({text: baseValue, value: firstArray, valueSecond: secondArray});
        let tmpArray = firstArray;
        let tmpArray1 = secondArray;
        for (let j = 0; j < tmpArray.length; j++) {
          this.apexGraph.dataFirst.push([timeCounter++, tmpArray[j]]);
          if (j < tmpArray1.length + 1)
            this.apexGraph.dataSecond.push([timeCounter, tmpArray1[j]]);
        }
      }
    },
    getGraphData(array, sensor_type) {
      this.apexGraph.dataFirst = [];
      this.apexGraph.dataSecond = [];
      this.setDropDownDataAll(array, sensor_type);
      this.setApexGraphData(array, sensor_type);
    },
    updateGraphValues(res, type) {
      this.reportData = [];
      this.show = false;
      if (type === SR) {
        this.getGraphData(res, SR)
        this.setGraphData("chartFirst", this.apexGraph.dataFirst);
      } else {
        this.getGraphData(res, type)
        this.setGraphData("chartFirst", this.apexGraph.dataFirst);
        this.setGraphData("chartSecond", this.apexGraph.dataSecond);
      }
    },
    setGraphData(seriesGraph, dataGraph) {
      if (seriesGraph === "chartFirst") {
        this.series = [{
          data: dataGraph
        }]
      } else if (seriesGraph === "chartSecond") {
        this.seriesLine2 = [{
          data: dataGraph
        }]
      } else {
        this.seriesArea = [{
          data: dataGraph
        }]
      }

    },
    skinResistanceButtonPressed() {
      console.log("Date picker val from " + this.datetime1 + " to " + this.datetime2)
      this.show = true;
      getSRData(this.datetime1, this.datetime2).then((res) => {
        this.updateGraphValues(res, SR);
      });
    },
    HRSPO2ButtonPressed() {
      this.show = true;
      getHRSPO2Data(this.datetime1, this.datetime2).then((res) => {
        this.updateGraphValues(res, HR_SPO2);
      });

    },
    ECGRRButtonPressed() {
      this.show = true;
      getECGRRData(this.datetime1, this.datetime2).then((res) => {
        this.updateGraphValues(res, ECG_RR);
      });
    },
    temperatureHumidityButtonPressed() {
      this.show = true;
      getTemperatureHumidityData(this.datetime1, this.datetime2).then((res) => {
        this.updateGraphValues(res, TEMP_HUMIDITY);
      });
    },
    updateGraphFromDropDown(id) {
      this.series = [{data: []}];
      let array2dFirstGraph = [];
      let array2dSecondGraph = [];
      let counter = 0;
      for (let i = 0; i < this.reportData.length; i++) {
        if (id === this.reportData[i].text) {
          let array = this.reportData[i].value;
          let arraySecond = this.reportData[i].valueSecond;
          for (let j = 0; j < array.length; j++) {
            array2dFirstGraph.push([counter++, array[j]]);
            if (j < arraySecond.length + 1)
            array2dSecondGraph.push([counter, arraySecond[j]]);
          }
        }
      }
      this.setGraphData("chartFirst", array2dFirstGraph);
      this.setGraphData("chartSecond", array2dSecondGraph);
    },
  }
}

function addNumberToBaseValue(baseVal, tv) {
  if (tv <= 9) {
    baseVal = baseVal + "0" + tv;
  } else {
    baseVal = baseVal + tv;
  }
  return baseVal;
}

function getBaseValue(td) {
  let baseVal = "";
  baseVal = baseVal + td.getFullYear() + "-";
  let tv = td.getMonth();
  baseVal = addNumberToBaseValue(baseVal, tv)+ "-";
  tv = td.getDay();
  baseVal = addNumberToBaseValue(baseVal, tv)+ "-";
  tv = td.getHours();
  baseVal = addNumberToBaseValue(baseVal, tv)+ "-";
  tv = td.getMinutes();
  baseVal = addNumberToBaseValue(baseVal, tv)+ "-";
  tv = td.getSeconds();
  baseVal = addNumberToBaseValue(baseVal, tv);
  return baseVal;
}

</script>

<style scoped>
h1, h2, h3 {
  font-family: "Montserrat-bold";
}

h3:hover {
  color: #42b983;
}

p {
  color: #8f8f8f;
}

.introduction {
  font-size: xxx-large;
}


.lineChartApex {
  width: 70%;
  margin-left: 10%;
}

.custom-date {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
}
</style>