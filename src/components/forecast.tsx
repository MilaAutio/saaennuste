import { SearchInput } from "./search";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from 'axios';
import * as convert from 'xml-js';

export const ForeCast = () => {

    const [selectedCity, setSelectedCity] = useState<string>('');

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
    }

    return <div className="forecast">
        <SearchInput changeCity={handleCityChange} selectedCity={selectedCity}/>
        <ForeCastResults selectedCity={selectedCity}/>
    </div>
};

const ForeCastResults = ({selectedCity}: any) => {

    const [weather, setWeather] = useState<any>({});

    useEffect(() => {
        //get current weather
        async function fetchCities() {
            const weatherData = await getWeather({selectedCity});
            setWeather(weatherData);
        }

        if( selectedCity !== '' ) {
            fetchCities();
        }

    }, [selectedCity]);

    //get the first weather value
    const entries = Object.entries(weather);
    const [currentWeatherTimeInEpoch, currentWeather] : [string, any] = entries.length > 0 ? entries[0] : ['No Key', 'No Value'];
    let currentWeatherTime;
    if(currentWeatherTimeInEpoch !== 'No Key') {
        const date = new Date(parseInt(currentWeatherTimeInEpoch) * 1000);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const dateFormatter = new Intl.DateTimeFormat('fi-FI', options);      
        currentWeatherTime = dateFormatter.format(date);
    }

    console.log(currentWeather)

    return <div className="forecast-results">
        { currentWeather !== 'No Value' && (
            <div className="current-weather">
                { currentWeatherTime && (
                    <div className="current-time">Sää {currentWeatherTime}</div>
                )}
                { currentWeather.temperature && (
                    <div className="temperature"><span className="number">{currentWeather.temperature}</span> °C</div>
                )}
                { currentWeather.windspeedms && (
                    <div className="wind">
                        { currentWeather.windvectorms && (
                            <div className="direction" style={{ transform: `rotateZ(${currentWeather.windvectorms}deg)` }}></div>
                        )}
                        <div className="speed"><span className="number">{currentWeather.windspeedms}</span> m/s</div>
                    </div>
                )}
            </div>
        )}
        <div className="forecast-for-next-three-days">
            <div className="date"></div>
            <div className="weather-condition"></div>
            <div className="temperature-lowest"></div>
            <div className="temperature-highest"></div>
            <div className="wind"></div>
            <div className="rain-amount"></div>
            <div className="hourly-forecast">
                <div className="row">
                    <div className="hour"></div>
                    <div className="weather-condition"></div>
                    <div className="temperature"></div>
                </div>
            </div>
        </div>
    </div>
}

interface GetCurrentWeatherProps {
    selectedCity: string;
}

interface WeatherData {
    timestamp: string;
    pressure: string;
    geopheight: string;
    temperature: string;
    dewpoint: string;
    humidity: string;
    winddirection: string;
    windspeedms: string;
    windvectorms: string;
    windums: string;
    windvms: string;
    precipitationtype: string;
    precipitationform: string;
    totalcloudcover: string;
    pop: string;
    probabilitythunderstorm: string;
    middleandlowcloudcover: string;
    lowcloudcover: string;
    mediumcloudcover: string;
    highcloudcover: string;
    radiationlw: string;
    radiationglobal: string;
    fogintensity: string;
    weathersymbol1: string;
    weathersymbol3: string;
    precipitation1h: string;
    frostprobability: string;
    severefrostprobability: string;
    hourlymaximumwindspeed: string;
    hourlymaximumgust: string;
    potentialprecipitationform: string;
    potentialprecipitationtype: string;
    weathernumber: string;
}

const getWeather = async ({selectedCity}: GetCurrentWeatherProps): Promise<string[]> => {
    try {
        //get data from ilmatieteenlaitos api
        const apiUrl : string = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::multipointcoverage&timestamp=60&place=' + selectedCity;
        const response : AxiosResponse<string> = await axios.get<string>( apiUrl, {
            headers: {
                "Content-Type": "application/xml; charset=utf-8"
            }
        })

        //convert data to js object
        const parsedData: any = await convert.xml2js(response.data, { compact: true });

        //get timestamps from data
        const positions : string = parsedData['wfs:FeatureCollection']['wfs:member']['omso:GridSeriesObservation']['om:result']['gmlcov:MultiPointCoverage']['gml:domainSet']['gmlcov:SimpleMultiPoint']['gmlcov:positions']['_text']
        let positionsArray : string[] = positions.split('\n');
        positionsArray = positionsArray.filter(item => item.trim() !== '');
        const timestamps = positionsArray.map((position:string) => {
            const positionArray = position.trim().split(' ');
            const timestamp = positionArray[3];
            return timestamp;
        })

        //get the data record
        const dataRecord : any = parsedData['wfs:FeatureCollection']['wfs:member']['omso:GridSeriesObservation']['om:result']['gmlcov:MultiPointCoverage']['gmlcov:rangeType']['swe:DataRecord']['swe:field']
        const dataRecordNames = dataRecord.map((row : any) => {
            return row['_attributes']['name'].toLowerCase()
        })

        //get the weather data
        const weatherData : string = parsedData['wfs:FeatureCollection']['wfs:member']['omso:GridSeriesObservation']['om:result']['gmlcov:MultiPointCoverage']['gml:rangeSet']['gml:DataBlock']['gml:doubleOrNilReasonTupleList']['_text']
        let weatherArray : string[] = weatherData.split('\n');
        weatherArray = weatherArray.filter(item => item.trim() !== '');
        const weather : any = weatherArray.map((data : any) => {
            const array = data.trim().split(' ');
            const weatherDataWithNames = array.reduce((weatherItem: any, item: any, index: any) => {
                if( dataRecordNames[index] === 'temperature' || dataRecordNames[index] === 'windspeedms' ) {
                    item = Math.round(item)
                }
                weatherItem[dataRecordNames[index]] = item;
                return weatherItem;
            }, {});
            return weatherDataWithNames;
        })

        //list of weather data with timestamps
        const weatherDataWithTimestamps = weather.reduce((array: any, item: any, index: number) => {
            array[timestamps[index]] = item
            return array;
        }, {});

        //return weather data with timestamps
        return weatherDataWithTimestamps;

    } catch(error) {
        console.log(error)
        return [];
    }
}