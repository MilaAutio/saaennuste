import { useState, useEffect } from 'react';
import { weatherDescriptions } from './weatherDescriptions';
import { WeatherConditionType } from '../types/weather';

// weather symbol component
export const WeatherSymbol = ({ symbol3, isDaytime }: any): any => {
  const [weatherCondition, setWeatherCondition] = useState<WeatherConditionType>({ description: '', color: '#FFFFFF' });
  const weatherIndex = Math.round(symbol3)

  useEffect(() => {
    
    const newCondition = weatherDescriptions[weatherIndex] || { description: 'Unknown', color: '#FFFFFF' };
    animateTheBackgroundColor(newCondition.color);
    setWeatherCondition(newCondition);

  }, [symbol3]);

  return (
    <div className="weather-condition">
      <div className="weather-symbol">
        {getWeatherSymbol( weatherIndex, weatherCondition.description )}
      </div>
    </div>
  );
};

// animate the body element background color
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const animateTheBackgroundColor = async (newColor: any) => {
  const bodyStyle = window.getComputedStyle(document.body);
  const bgColor = bodyStyle.backgroundColor;

  if (bgColor !== newColor) {
    for (let i = 0; i <= 100; i++) {
      document.body.style.background = `radial-gradient(circle, ${newColor} ${i}%, ${bgColor} 100%)`;
      await wait(10);
    }

    document.body.style.background = newColor;
  }
};

export const getWeatherSymbol = (index: number, altText: string) => {
  try {
    var image = require(`../assets/images/weather-symbols/${index}.svg`)
    return <img src={image} alt={altText} />
  } catch (e) {
    return ''; // or fallback icon
  }
};
