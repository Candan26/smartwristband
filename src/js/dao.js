
const SR = "sr"
const HR = "hr"
const ECG = "ecg"
const TH = "th"
const IP = "165.22.200.210"
const PORT = "7547"

class skinResistance {
    constructor(date, id, personName, personSurname, srValue, status) {
        this._date = date;
        this._id = id;
        this._personName = personName;
        this._personSurname = personSurname;
        this._srValue = srValue;
        this._status = status;
        this._parsed = this.parseSkinRawData(srValue);
    }

    parseSkinRawData(stringToParse) {
        let array = [];
        for (var i = 0; i < stringToParse.length; i = i + 4) {
            var mySubString = "0x" + stringToParse.substring(i, i + 4);
            array.push(parseInt(mySubString, 16));
        }
        return array;
    }

    getParsedData() {
        return this._parsed;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get personName() {
        return this._personName;
    }

    set personName(value) {
        this._personName = value;
    }

    get personSurname() {
        return this._personSurname;
    }

    set personSurname(value) {
        this._personSurname = value;
    }

    get srValue() {
        return this._srValue;
    }

    set srValue(value) {
        this._srValue = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }
}

class hrSpo2 {
    constructor(date, id, personName, personSurname, hrValue, spo2Value, iredValue, redValue, status) {
        this._date = date;
        this._id = id;
        this._personName = personName;
        this._personSurname = personSurname;
        this._hrValue = hrValue;
        this._spo2Value = spo2Value;
        this._ired = iredValue;
        this._red = redValue;
        this._status = status;
        this._parsedHR = this.parseRawData(hrValue, "byte");
        this._parsedSPO2 = this.parseRawData(spo2Value, "byte");
        this._parsedIRed = this.parseRawData(iredValue, "int");
        this._parsedRed = this.parseRawData(redValue, "int");
    }

    parseRawData(stringToParse, type) {
        let array = [];
        let parser = 0;
        if(type === "byte"){
            parser = 2;
        }else if(type === "int"){
            parser = 8;
        }
        for (var i = 0; i < stringToParse.length; i = i + parser) {
            var mySubString = "0x" + stringToParse.substring(i, i + parser);
            array.push(parseInt(mySubString, 16));
        }
        return array;
    }

    getParsedHRData() {
        return this._parsedHR;
    }

    getParsedSPO2Data() {
        return this._parsedSPO2;
    }

    getParsedIRedData(){
        return this._parsedIRed;
    }

    getParsedRedData(){
        return this._parsedRed;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get personName() {
        return this._personName;
    }

    set personName(value) {
        this._personName = value;
    }

    get personSurname() {
        return this._personSurname;
    }

    set personSurname(value) {
        this._personSurname = value;
    }

    get hrValue() {
        return this._hrValue;
    }

    set hrValue(value) {
        this._hrValue = value;
    }

    get spo2Value() {
        return this._spo2Value;
    }

    set spo2Value(value) {
        this._spo2Value = value;
    }

    get redValue() {
        return this._red;
    }

    set redValue(value) {
        this._red = value;
    }

    get iredValue() {
        return this._ired;
    }

    set iredValue(value) {
        this._ired = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }
}

class ecgRr {
    constructor(date, id, personName, personSurname, ecgValue, rrValue, status) {
        this._date = date;
        this._id = id;
        this._personName = personName;
        this._personSurname = personSurname;
        this._ecgValue = ecgValue;
        this._rrValue = rrValue;
        this._status = status;
        this._parsedECG = this.parseRawData(ecgValue,"short");
        this._parsedRR = this.parseRawData(rrValue,"int");

    }

    parseRawData(stringToParse, type) {
        let array = [];
        let parser = 0;
        if(type === "short"){
            parser = 4
        }else if(type === "int"){
            parser = 8
        }
        for (var i = 0; i < stringToParse.length; i = i + parser) {
            var mySubString = "0x" + stringToParse.substring(i, i + parser);
            array.push(parseInt(mySubString, 16));
        }
        return array;
    }

    getParsedECGData() {
        return this._parsedECG;
    }

    getParsedRRData() {
        return this._parsedRR;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get personName() {
        return this._personName;
    }

    set personName(value) {
        this._personName = value;
    }

    get personSurname() {
        return this._personSurname;
    }

    set personSurname(value) {
        this._personSurname = value;
    }

    get ecgValue() {
        return this._ecgValue;
    }

    set ecgValue(value) {
        this._ecgValue = value;
    }

    get rrValue() {
        return this._rrValue;
    }

    set rrValue(value) {
        this._rrValue = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }
}

class tempAndHumidity {
    constructor(date, id, personName, personSurname, temperatureValue, humidityValue, status) {
        this._date = date;
        this._id = id;
        this._personName = personName;
        this._personSurname = personSurname;
        this._temperatureValue = temperatureValue;
        this._humidityValue = humidityValue;
        this._status = status;
        this._parsedTemperature = this.parseRawData(temperatureValue);
        this._parsedHumidityValue = this.parseRawData(humidityValue);

    }

    parseRawData(stringToParse) {
        let array = [];
        for (var i = 0; i < stringToParse.length; i = i + 8) {
            var mySubString = "0x" + stringToParse.substring(i, i + 8);
            array.push(parseHexToFloat(mySubString));
        }
        return array;
    }

    getParsedTemperatureData() {
        return this._parsedTemperature;
    }

    getParsedHumidityValueData() {
        return this._parsedHumidityValue;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get personName() {
        return this._personName;
    }

    set personName(value) {
        this._personName = value;
    }

    get personSurname() {
        return this._personSurname;
    }

    set personSurname(value) {
        this._personSurname = value;
    }

    get temperatureValue() {
        return this._temperatureValue;
    }

    set temperatureValue(value) {
        this._temperatureValue = value;
    }

    get humimidtyValue() {
        return this._humidityValue;
    }

    set humidityValue(value) {
        this._humidityValue = value;
    }
    
    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }
}

function parseHexToFloat(str) {
    var float = 0, sign,  exp,
        int = 0, multi = 1;
    if (/^0x/.exec(str)) {
        int = parseInt(str, 16);
    } else {
        for (var i = str.length - 1; i >= 0; i -= 1) {
            if (str.charCodeAt(i) > 255) {
                console.log('Wrong string parametr');
                return false;
            }
            int += str.charCodeAt(i) * multi;
            multi *= 256;
        }
    }
    sign = (int >>> 31) ? -1 : 1;
    exp = (int >>> 23 & 0xff) - 127;
    var mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i = 0; i < mantissa.length; i += 1) {
        float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
        exp--;
    }
    return float * sign;
}
// Get Writing Data
export function getSRData(from, to) {
    const url = "http://"+IP+":"+PORT+"/api/skin/date/?date_from=" + Date.parse(from) + "&date_to=" + Date.parse(to);
    return getRawData(url, SR);
}

export  function getSRDataOnline(){
    const url = "http://"+IP+":"+PORT+"/api/skin/getQueue";
    return getRawData(url, SR);
}

export function getECGRRData(from, to) {
    const url = "http://"+IP+":"+PORT+"/api/max3003/date/?date_from=" + Date.parse(from) + "&date_to=" + Date.parse(to);
    return getRawData(url, ECG);
}

export  function getECGRRDataOnline(){
    const url = "http://"+IP+":"+PORT+"/api/max3003/getQueue";
    return getRawData(url, ECG);
}

export function getHRSPO2Data(from, to) {
    const url = "http://"+IP+":"+PORT+"/api/max30102/date/?date_from=" + Date.parse(from) + "&date_to=" + Date.parse(to);
    return getRawData(url, HR);
}

export  function getHRSPO2DataOnline(){
    const url = "http://"+IP+":"+PORT+"/api/max30102/getQueue";
    return getRawData(url, HR);
}

export function getTemperatureHumidityData(from, to) {
    const url = "http://"+IP+":"+PORT+"/api/si7021/date/?date_from=" + Date.parse(from) + "&date_to=" + Date.parse(to);
    return getRawData(url, TH);
}

export  function getTemperatureHumidityDataOnline(){
    const url = "http://"+IP+":"+PORT+"/api/si7021/getQueue";
    return getRawData(url, TH);
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function getRawData(url, data_type) {
    return fetch(url)
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            let jsonArrayString = JSON.stringify(res);
            let jsonArray = JSON.parse(jsonArrayString);
            let returnArray = []
            if(isArray(jsonArray)) {
                for (let i = 0; i < jsonArray.length; i++) { // jsonArray.length
                    returnArray.push(getParsedData(jsonArray[i], data_type));
                }
            } else {
                returnArray.push(getParsedData(jsonArray, data_type));
            }
            return returnArray;
        })
}

function getParsedData(jsonObj, type) {
    let ro;
    if (type === SR)
        ro = new skinResistance(jsonObj.date, jsonObj.id, jsonObj.personName, jsonObj.personSurname, jsonObj.srValue, jsonObj.status);
    else if (type === HR)
        ro = new hrSpo2(jsonObj.date, jsonObj.id, jsonObj.personName, jsonObj.personSurname, jsonObj.hr, jsonObj.spo2,jsonObj.ired,jsonObj.red, jsonObj.status);
    else if(type === ECG)
        ro = new ecgRr(jsonObj.date, jsonObj.id, jsonObj.personName, jsonObj.personSurname, jsonObj.ecg, jsonObj.rr, jsonObj.status);
    else if(type === TH)
        ro = new tempAndHumidity(jsonObj.date, jsonObj.id, jsonObj.personName, jsonObj.personSurname, jsonObj.temperature, jsonObj.humidity, jsonObj.status)
    return ro;
}
