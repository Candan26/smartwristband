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


        <datetime type="datetime" v-model="datetime1" format="yyyy-MM-dd'T'HH:mm:ss.SSSZ" placeholder="from"></datetime>
        <datetime type="datetime" v-model="datetime2" format="yyyy-MM-dd'T'HH:mm:ss.SSSZ" placeholder="to"></datetime>
        <b-form-checkbox v-model="checked" name="check-button" switch size="lg" @change="startStopOnlineDataPressed">
          Get Online Data <b> = {{ checked }}</b>
        </b-form-checkbox>


      </div>
    </div>
    <!--Raw data imp -->
    <div>
      <h1>Data observation from raw data</h1>
      <div>
        <b-form-checkbox-group
            v-model="selectedCb"
            :options="options"
            class="mb-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
        ></b-form-checkbox-group>
        <input type="range" min="1" max="1000" step="1" v-model ="vmiSpeedOfAnimation"><span v-text="vmiSpeedOfAnimation"></span>

      </div>

      <a class="btn btn-md btn-outline-warning" @click="skinResistanceButtonPressed" href="#">
        <font-awesome-icon icon="user-shield" size="3x"/>
        Skin Resistance</a>

      <a class="btn btn-md btn-outline-success" @click="HRSPO2ButtonPressed" href="#">
        <font-awesome-icon icon="heartbeat" size="3x"/>
        HR & SPO2</a>

      <a class="btn btn-md btn-outline-primary" @click="ECGRRButtonPressed" href="#">
        <font-awesome-icon icon="signature" size="3x"/>
        ECG & RR</a>

      <a class="btn btn-md btn-outline-danger" @click="temperatureHumidityButtonPressed" href="#">
        <font-awesome-icon icon="tint" size="3x"/>
        <font-awesome-icon icon="temperature-high" size="3x"/>
        Temp & Humidity</a>


      <download-excel :fetch="fetchTodos" :name="fileNameExcel">
        <button type="button" class="btn btn-md btn-outline-success">
          <font-awesome-icon icon="file-excel" size="3x"/> Download Excel</button>
      </download-excel>
      <b-dropdown text="Select Date(Y/M/D/H/M/S)" class="m-md-2" boundary="scrollParent" >
        <b-dropdown-item v-for="(item, key) in reportData" :key="key" :value="item.text"
                         @click="updateGraphFromDropDown(item.text)">
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


    <div class="onlineData" v-show="hideOnlineData">


      <div class="divChardEcgRr" v-show="ER">
        <h1>DYNAMIC ECG DATA </h1>
        <apexchart type="line" height="350" ref="chart" :options="chartOptionsReal" :series="seriesECG"></apexchart>
      </div>


      <div class="divChardEcgRr" v-show="ER">
        <h1>DYNAMIC RR DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsReal" :series="seriesRR"></apexchart>
      </div>


      <div class="divChardHrSpo2" v-show="HR">
        <h1>DYNAMIC HR DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsReal" :series="seriesHR"></apexchart>
      </div>


      <div class="divChardHrSpo2" v-show="HR">
        <h1>DYNAMIC SPO2 DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsReal" :series="seriesSPO2"></apexchart>
      </div>


      <div class="divChardHrSpo2" v-show="HR">
        <h1>DYNAMIC HR/IRED DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsRedIredBoth" :series="seriesRedIredBoth"></apexchart>
      </div>


      <div class="divChardHumTemp" v-show="HT">
        <h1>DYNAMIC TEMPERATURE DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsReal" :series="seriesTemp"></apexchart>
      </div>


      <div class="divChardHumTemp"  v-show="HT">
        <h1>DYNAMIC HUMIDITY DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsReal" :series="seriesHumid"></apexchart>
      </div>


      <div class="divChartSkin"  v-show="SR">
        <h1>DYNAMIC SKIN RESISTANCE DATA </h1>
        <apexchart type="line" height="350"  ref="chart" :options="chartOptionsReal" :series="seriesSkin"></apexchart>
      </div>
    </div>

  </div>
</template>

<script>
import {getTemperatureHumidityData} from '../js/dao';
import {getTemperatureHumidityDataOnline} from '../js/dao';
import {getHRSPO2Data} from '../js/dao';
import {getHRSPO2DataOnline} from '../js/dao';
import {getECGRRData} from '../js/dao';
import {getECGRRDataOnline} from '../js/dao';
import {getSRData} from '../js/dao';
import {getSRDataOnline} from '../js/dao';

let ecgCounter = 0;

const SR = "SR";
const HR_SPO2 = "HR";
const ECG_RR = "ECG";
const TEMP_HUMIDITY = "TH";
//
//let ECGRROnlineArray = [];
let ECGOnlineArray = [];
let HRSPO2OnlineArray = [];
let THOnlineArray = [];
let SKINOnlineArray = [];
//
const CHART_ECG = "chartOnlineECG";
const CHART_RR = "chartOnlineRR";
const CHART_HR = "chartOnlineHR";
const CHART_SPO2 = "chartOnlineSPO2";
const CHART_TEMP = "chartOnlineTemp";
const CHART_HUMID = "chartOnlineHumid";
const CHART_SKIN = "chartOnlineSkin";

export default {
  name: "SWB",
  data() {
    return {
      fileNameExcel: "test",
      vmiSpeedOfAnimation: 1000,
      intervalStatusECG: null,
      checked: false,
      hideOnlineData: false,
      ER: false,
      SR: false,
      HR: false,
      HT: false,
      show: false,
      datetime1: null,
      datetime2: null,
      intervalStatus: null,
      apexGraph: {
            dataFirst: [],
            dataSecond: []
          },
      apexGraphReal: {
        ecg: [],
        rr: [],
        hr: [],
        spo2: [],
        temp: [],
        hum: [],
        skin: [],
        red: [],
        ired: []
      },
      series: [{
        data: []
      }],
      reportData: [{
        text: '',
        value: [],
        valueSecond: [],
      }],
      selectedCb: [],
      options: [
        { item: ECG_RR, name: 'ECG & RR' },
        { item: HR_SPO2, name: 'HR & SPO2' },
        { item: SR, name: 'SKIN ' },
        { item: TEMP_HUMIDITY, name: 'HUMIDITY TEMPERATURE' }
      ],
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
      seriesECG: [{
        data: []
      }],
      seriesRR: [{
        data: []
      }],
      seriesHR: [{
        data: []
      }],
      seriesSPO2: [{
        data: []
      }],
      seriesTemp: [{
        data: []
      }],
      seriesHumid: [{
        data: []
      }],
      seriesSkin: [{
        data: []
      }],
      seriesRedIredBoth: [
        {
          name : 'Ired',
          data : []
        },
        {
          name : 'Red',
          data : []
        }
      ],
      chartOptionsReal: {
        chart: {
          id: 'realtime',
          height: 160,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              enabled: true,
              speed: this.vmiSpeedOfAnimation
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Dynamic  Chart',
          align: 'left'
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: 'numeric',
        },
        yaxis: {
        },
        legend: {
          show: false
        },
      },
      chartOptionsRedIredBoth:{
        xaxis: {
          categories: ['Red', 'Ired']
        },
        yaxis: [{
          show: true
        },{
          labels: {show: false}
        }]
      },
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
    async fetchTodos(){
      if(this.datetime2 ===null || this.datetime1 === null){
        alert("Select both date picker field");
        return;
      }
    if(this.selectedCb.length ===0 ){
        alert("Select one of checkbox");
        return;
      }
      if(this.selectedCb.length > 1 ){
        alert("Only one of field can be downloaded at once ");
        return;
      }
      if(this.selectedCb.includes(SR)){
        this.fileNameExcel="SkinResistanceData";
        let response = await getSRData(this.datetime1, this.datetime2).then((res) => {
          let returnArray = [];
          for (let i = 0; i < res.length; i++) {
            let parsed = res[i].getParsedData();
            for (let j = 0; j < parsed.length; j++) {
              let map = new Map();
              map["SR"] = parsed[j];
              returnArray.push(map);
            }
          }
          return returnArray;
        });
        return response;
      }
      if(this.selectedCb.includes(HR_SPO2)){
        this.fileNameExcel="HrSpo2Data";
        let response = await getHRSPO2Data(this.datetime1, this.datetime2).then((res) => {
          let returnArray = [];
          for (let i = 0; i < res.length; i++) {
            let parsedHR = res[i].getParsedHRData();
            let parsedSPO2  = res[i].getParsedSPO2Data();
            let parsedIred = res[i].getParsedIRedData();
            let parsedRed= res[i].getParsedRedData();
            for (let j = 0; j < parsedHR.length; j++) {
              let map = new Map();
              map["HR"] = parsedHR[j];
              map["SPO2"] = parsedSPO2.shift();
              map["IRED"] =  parsedIred.shift();
              map["RED"] = parsedRed.shift();
              returnArray.push(map);
            }
          }
          return returnArray;
        });
        return response;
      }
      if(this.selectedCb.includes(ECG_RR)){
        this.fileNameExcel="EcgRrData";
        let response = await getECGRRData (this.datetime1, this.datetime2).then((res) => {
          let returnArray = [];
          for (let i = 0; i < res.length; i++) {
            let parsedECG = res[i].getParsedECGData();
            let parsedRR  = res[i].getParsedRRData();
            for (let j = 0; j < parsedECG.length; j++) {
              let map = new Map();
              map["ECG"] = parsedECG[j];
              map["RR"] = parsedRR.shift();
              returnArray.push(map);
            }
          }
          return returnArray;
        });
        return response;
      }
      if(this.selectedCb.includes(TEMP_HUMIDITY)){
        this.fileNameExcel="HumidityAndTemperatureData";
        let response = await getTemperatureHumidityData(this.datetime1, this.datetime2).then((res) => {
          let returnArray = [];
          for (let i = 0; i < res.length; i++) {
            let parsedTemperatureData = res[i].getParsedTemperatureData();
            let parsedHumidityValueData = res[i].getParsedHumidityValueData();
            for (let j = 0; j < parsedTemperatureData.length; j++) {
              let map = new Map();
              map["TEMPERATURE"] = parsedTemperatureData[j];
              map["HUMIDITY"] = parsedHumidityValueData.shift();
              returnArray.push(map);
            }
          }
          return returnArray;
        });
        return response;
      }


    },
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
        if(sensor_type === ECG_RR){
          let ta = []
          let tb = []
          for (let m = 0 ; m < firstArray.length ; m +=300 ){
              ta = firstArray.slice(m, m + 300 );
              tb = secondArray.slice(m, m+ 300);
              let delimeter =  m / 300;
            this.reportData.push({text: baseValue +"/" +delimeter, value: ta, valueSecond: tb});
          }
          this.reportData.push({text: baseValue + "Set", value: firstArray, valueSecond: secondArray});
        }else {
          this.reportData.push({text: baseValue, value: firstArray, valueSecond: secondArray});
        }

        let tmpArray = firstArray;
        let tmpArray1 = secondArray;
        if(i > 1 )
          continue;
        for (let j = 0; j < tmpArray.length; j++) {
          if(sensor_type === ECG_RR){
            if(j > 300)
              continue;
          }
          this.apexGraph.dataFirst.push([timeCounter++, tmpArray[j]]);
          if (j < tmpArray1.length + 1)
            this.apexGraph.dataSecond.push([timeCounter, tmpArray1[j]]);
        }
      }
    },
    getGraphData(array, sensor_type) {
      this.apexGraph.dataFirst = [];
      this.apexGraph.dataSecond = [];

      this.setApexGraphData(array, sensor_type);
      this.setDropDownDataAll(array, sensor_type);
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
    updateGraphValuesReal(res, type) {
      let firstArray = [];
      let secondArray = [];
      let mergeFirstArray = [];
      let mergeSecondArray = [];
      let timeCounter = 0;
      let ra1 = [];
      let ram1 = [];
      let ra2 = [];
      let ram2 =[];

      this.apexGraphReal.ecg = [];
      this.apexGraphReal.rr = [];
      this.apexGraphReal.hr = [];
      this.apexGraphReal.spo2 = [];
      this.apexGraphReal.temp = [];
      this.apexGraphReal.hum = [];
      this.apexGraphReal.skin = [];
      this.apexGraphReal.ired = [];
      this.apexGraphReal.red = [];

      for (let i = 0; i < res.length; i++) {
        if (type === ECG_RR) {
          firstArray = res[i][0].getParsedECGData();
          secondArray = res[i][0].getParsedRRData();
        } else if (type === HR_SPO2) {
          firstArray = res[i][0].getParsedHRData();
          secondArray = res[i][0].getParsedSPO2Data();
          mergeFirstArray = res[i][0].getParsedIRedData();
          mergeSecondArray= res[i][0].getParsedRedData();
        } else if (type === TEMP_HUMIDITY) {
          firstArray = res[i][0].getParsedTemperatureData();
          secondArray = res[i][0].getParsedHumidityValueData();
        } else if (type === SR) {
          firstArray = res[i][0].getParsedData();
        }

        let tmpArray = firstArray;
        let tmpArray1 = secondArray;

        for (let j = 0; j < tmpArray.length; j++) {
          ra1.push([timeCounter++, tmpArray[j]]);
          if (j < tmpArray1.length + 1){
            ra2.push([timeCounter, tmpArray1[j]]);
          }
        }
        if(type === HR_SPO2){
          tmpArray = mergeFirstArray;
          tmpArray1 = mergeSecondArray;
          for (let j = 0; j < tmpArray.length; j++) {
            ram1.push([timeCounter++, tmpArray[j]]);
            if (j < tmpArray1.length + 1){
              ram2.push([timeCounter, tmpArray1[j]]);
            }
          }
          this.seriesRedIredBoth =[
            {
              name : 'Ired',
              data :ram1
            },
            {
              name : 'Red',
              data : ram2
            }
          ]
        }
      }
      this.pushApexOnlineData(type, ra1, ra2);
      this.setOnlineGraphData(type);
    },
    pushApexOnlineData(type, ra1, ra2) {
      if (type === ECG_RR) {
        this.apexGraphReal.ecg = ra1;
        this.apexGraphReal.rr = ra2;
      } else if (type === HR_SPO2) {
        this.apexGraphReal.hr = ra1;
        this.apexGraphReal.spo2 = ra2;
      } else if (type === TEMP_HUMIDITY) {
        this.apexGraphReal.temp = ra1;
        this.apexGraphReal.hum = ra2;
      } else if (type === SR) {
        this.apexGraphReal.skin = ra1;
      }
    },
    setOnlineGraphData(type) {
      if (type === ECG_RR) {
        this.setGraphData(CHART_ECG, this.apexGraphReal.ecg);
        this.setGraphData(CHART_RR, this.apexGraphReal.rr);
      } else if (type === HR_SPO2) {
        this.setGraphData(CHART_HR, this.apexGraphReal.hr);
        this.setGraphData(CHART_SPO2, this.apexGraphReal.spo2);
      } else if (type === TEMP_HUMIDITY) {
        this.setGraphData(CHART_TEMP, this.apexGraphReal.temp);
        this.setGraphData(CHART_HUMID, this.apexGraphReal.hum);
      } else if (type === SR) {
        this.setGraphData(CHART_SKIN, this.apexGraphReal.skin);
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
      } else if (seriesGraph === CHART_ECG) {
        this.seriesECG = [{
          data: dataGraph
        }]
      } else if (seriesGraph === CHART_RR) {
        this.seriesRR = [{
          data: dataGraph
        }]
      } else if (seriesGraph === CHART_HR) {
        this.seriesHR = [{
          data: dataGraph
        }]
      } else if (seriesGraph === CHART_SPO2) {
        this.seriesSPO2 = [{
          data: dataGraph
        }]
      } else if (seriesGraph === CHART_TEMP) {
        this.seriesTemp = [{
          data: dataGraph
        }]
      } else if (seriesGraph === CHART_HUMID) {
        this.seriesHumid = [{
          data: dataGraph
        }]
      } else if (seriesGraph === CHART_SKIN) {
        this.seriesSkin = [{
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
    startStopOnlineDataPressed() {

      if (this.checked === false) {
        this.hideOnlineData = false;
        clearInterval(this.intervalStatus);
      } else {
        this.hideOnlineData = true;
        this.startOnlineStream()
      }


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
    startOnlineECGData(){
      ecgCounter = ecgCounter +1
      this.apexGraphReal.ecg.push([ecgCounter, ECGOnlineArray.shift()]);

      // TODO Fill
      if(ecgCounter >= 150) {
        ecgCounter = 0
        this.apexGraphReal.ecg = []
        //this.setGraphData( this.apexGraphReal.ecg,CHART_ECG )
      }
      console.log(this.apexGraphReal.ecg)
      this.seriesECG = [{
        data: this.apexGraphReal.ecg
      }]
      //this.setGraphData( this.apexGraphReal.ecg,CHART_ECG )
    },
    startOnlineStream() {
      let that = this;
      this.intervalStatus = setInterval(function () {
        if(that.selectedCb.includes(ECG_RR)){
          getECGRRDataOnline().then((res) => {
            let ar = [];
            ar = res[0].getParsedECGData()
            for (let i = 0; i < ar.length; i++) {
              ECGOnlineArray.push(ar[i])
            }
          })
          that.ER = true;
        }else{
          that.ER = false;
          clearInterval(that.intervalStatusECG);
        }

        if(that.selectedCb.includes(HR_SPO2)){
          getHRSPO2DataOnline().then((res) => {
            HRSPO2OnlineArray.push(res);
            if (HRSPO2OnlineArray.length > 100) {
              HRSPO2OnlineArray = HRSPO2OnlineArray.slice(HRSPO2OnlineArray.length-10, HRSPO2OnlineArray.length);
            }
            that.updateGraphValuesReal(HRSPO2OnlineArray, HR_SPO2);
          });
          that.HR = true;
        }else {
          that.HR = false;
        }

        if(that.selectedCb.includes(TEMP_HUMIDITY)){
          getTemperatureHumidityDataOnline().then((res) => {
            THOnlineArray.push(res);
            if (THOnlineArray.length > 100) {
              THOnlineArray = THOnlineArray.slice(THOnlineArray.length-10, THOnlineArray.length);
            }
            that.updateGraphValuesReal(THOnlineArray, TEMP_HUMIDITY);
          });
          that.HT = true;
        }else {
          that.HT = false;
        }

        if(that.selectedCb.includes(SR)){
          getSRDataOnline().then((res) => {
            SKINOnlineArray.push(res);
            if (SKINOnlineArray.length >100) {
              SKINOnlineArray = SKINOnlineArray.slice(SKINOnlineArray.length-10 , SKINOnlineArray.length);
            }
            that.updateGraphValuesReal(SKINOnlineArray, SR);
          });
          that.SR = true;
        }else {
          that.SR = false;
        }

      }, 500);

      if(that.selectedCb.includes(ECG_RR)) {

        this.intervalStatusECG = window.setInterval(function () {
          console.log("entered online data");
          that.startOnlineECGData()
        }, 50)
      }
    }

  },
  created: function () {
    this.startOnlineStream();
    clearInterval(this.intervalStatus);
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
  baseVal = addNumberToBaseValue(baseVal, tv) + "-";
  tv = td.getDay();
  baseVal = addNumberToBaseValue(baseVal, tv) + "-";
  tv = td.getHours();
  baseVal = addNumberToBaseValue(baseVal, tv) + "-";
  tv = td.getMinutes();
  baseVal = addNumberToBaseValue(baseVal, tv) + "-";
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