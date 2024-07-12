import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import * as convert from 'xml-js';
import { CitiesResponse, CityResponse } from '../interfaces/cities';

//input field where user chooses the city they want the forecast from
export const SearchInput = () => {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [showDropDownMenu, setShowDropDownMenu] = useState<boolean>(false);
    const [dropDownSearchResults, setDropDownSearchResults] = useState<string[]>([]);
    const dropDownMenu = useRef<HTMLDivElement>(null);

    useEffect(() => {

        //get list of available cities
        async function fetchCities() {
            const citiesData = await getListOfCities();
            setCities(citiesData);
            setDropDownSearchResults(citiesData);
        }
        fetchCities();
    
        //close dropdown menu when clicked outside of dropdown element
        const handleClickOutside = (event: MouseEvent) => {
            if (dropDownMenu.current && !dropDownMenu.current.contains(event.target as Node)) {
                setShowDropDownMenu(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);
    
    //handles the selection of city from the dropdown menu
    const handleMenuItemClick = (city:string) : void => {
        setSelectedCity(city);
        setShowDropDownMenu(false);
        setDropDownSearchResults(cities);
    }

    //handles the selectCity elements on change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedCity(event.target.value);
        const searchResults = cities.filter((city:string) => {
            return city.toLowerCase().includes(event.target.value.toLowerCase()) && city;
        })
        setShowDropDownMenu(true);
        setDropDownSearchResults(searchResults);
    }

    //returns the dropdown of the cities
    return (
        <div className='selectCity' ref={dropDownMenu}>
            <input type='text' id='selectedCity' placeholder='Hae kaupunkia...' value={selectedCity} onChange={handleInputChange} onClick={() => setShowDropDownMenu(true)} />
            { showDropDownMenu && (
                <div className='dropdown-menu'>
                    {
                        dropDownSearchResults && dropDownSearchResults.map((city:string, index:number) => {
                            return <div key={index} className="menu-item" onClick={() => handleMenuItemClick(city)}>{city}</div>
                        })
                    }
                </div>
            )}
        </div>
    )
}

//get list of cities from ilmatieteenlaitos api
const getListOfCities = async (): Promise<string[]> => {
    try {

        //get data from ilmatieteenlaitos api
        const response : AxiosResponse<string> = await axios.get<string>('https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=ecmwf::forecast::surface::cities::multipointcoverage&timestep=120&parameters=temperature', {
            headers: {
                "Content-Type": "application/xml; charset=utf-8"
            }
        })

        //convert data to js object
        const parsedData: CitiesResponse = await convert.xml2js(response.data, { compact: true }) as CitiesResponse;

        //get lists of cities from parsed data
        const locations = parsedData['wfs:FeatureCollection']['wfs:member']['omso:GridSeriesObservation']['om:featureOfInterest']['sams:SF_SpatialSamplingFeature']['sam:sampledFeature']['target:LocationCollection']['target:member'];
        const listOfCities : string[] = locations.map((place:CityResponse) => {
            return place['target:Location']['gml:name'][0]['_text']
        })

        //sort array in alphabetical order
        const sortedItems : string[] = [...listOfCities].sort((a, b) => a.localeCompare(b));

        //return list
        return sortedItems;

    } catch(error) {
        console.log(error)
        return [];
    }
}