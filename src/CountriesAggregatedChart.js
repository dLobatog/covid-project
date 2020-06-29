import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { csv } from 'd3';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';

const ALLOWED_COUNTRIES = ['Spain', 'Germany', 'US', 'United Kingdom']

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
    <g>
        <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
        <circle
            r={size / 5}
            strokeWidth={borderWidth}
            stroke={borderColor}
            fill={color}
            fillOpacity={0.35}
        />
    </g>
)

const CountriesAggregatedChart = () => {
    const [data, setData] = useState([]);

    const generateData = () => {
        csv(
            'https://datahub.io/core/covid-19/r/time-series-19-covid-combined.csv',
            //'https://datahub.io/core/covid-19/r/key-countries-pivoted.csv'
        ).then(data => {
            const results = []
            forEach(
                filter(
                    groupBy(data, 'Country/Region'),
                    (data, country) => (ALLOWED_COUNTRIES.includes(country))
                ), (data, country) => (
                results.push(
                    {
                        "id": data[0]["Country/Region"],
                        "data": data.map(entry => ({
                            "x": entry.Date,
                            "y": parseInt(entry.Deaths)
                        }))
                    }
                )
                ));
                setData(results);
        });
    };

    useEffect(
        () => { generateData(); }
    );

    if (data === []) {
        return <div/>;
    }

	return <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        axisTop={null}
        axisRight={null}
        curve='monotoneX'
        axisBottom={{
            format: '%b %d',
            tickValues: 'every 15 days',
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'date',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointSymbol={CustomSymbol}
        pointSize={2}
        pointLabel="count"
        pointLabelYOffset={-12}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />;
};

export default CountriesAggregatedChart;
