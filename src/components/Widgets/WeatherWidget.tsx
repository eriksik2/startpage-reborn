
import React from "react";
import dateFormat from "dateformat";

import { BsCloudFill, BsCloudDrizzleFill, BsCloudHailFill, BsCloudLightningFill, BsCloudLightningRainFill, BsCloudHazeFill, BsCloudRain, BsCloudRainHeavy, BsCloudSleet, BsCloudSnow, BsCloudHail, BsCloudRainFill, BsCloudRainHeavyFill, BsCloudSleetFill, BsCloudSnowFill, BsCloudSunFill, BsCloudsFill, BsSunFill } from "react-icons/bs";
import { editableBoolean, editableSelection } from "widgets/WidgetDescriptor";


type WeatherDay = {
    date: Date,
    maxTemp: number,
    minTemp: number,
    weatherCode: number,
};

type WeatherWidgetProps = {
    daysShown?: number,
    temperatureUnit?: "celsius" | "fahrenheit",
    dayNameFormat?: "short" | "long",
    dailyShowMaxTemp?: boolean,
    dailyShowMinTemp?: boolean,
    dailyShowWeatherCode?: boolean,
};


type WeatherWidgetState = {
    weather: WeatherDay[],
    showDetails: number | null,
};

export class WeatherWidget extends React.Component<WeatherWidgetProps, WeatherWidgetState> {
    static defaultProps = {
        daysShown: 3,
        temperatureUnit: "celsius",
        dayNameFormat: "short",
        dailyShowMaxTemp: true,
        dailyShowMinTemp: true,
        dailyShowWeatherCode: true,
    };

    static editablePropTypes = {
        daysShown: editableSelection(["1", "2", "3", "4", "5"], {
            displayName: "Show days",
        }),
        temperatureUnit: editableSelection(["celsius", "fahrenheit"], {
            displayName: "Temperature Unit",
        }),
        dayNameFormat: editableSelection(["short", "long"], {
            displayName: "Weekday format",
        }),
        dailyShowMaxTemp: editableBoolean({
            category: "Daily readings",
            displayName: "Show Max Temperature",
        }),
        dailyShowMinTemp: editableBoolean({
            category: "Daily readings",
            displayName: "Show Min Temperature",
        }),
        dailyShowWeatherCode: editableBoolean({
            category: "Daily readings",
            displayName: "Show Weather Code",
        }),
    };

    constructor(props: WeatherWidgetProps) {
        super(props);
        this.state = {
            weather: [],
            showDetails: 0,
        };

        this.handleClickDay = this.handleClickDay.bind(this);
    }

    celciusToFahrenheit = (c: number) => c * 9 / 5 + 32;

    componentDidMount() {
        this.refreshData();
    }

    componentDidUpdate(prevProps: Readonly<WeatherWidgetProps>, prevState: Readonly<WeatherWidgetState>, snapshot?: any): void {
        if(prevProps.daysShown !== this.props.daysShown) {
            if (prevProps.daysShown! < this.props.daysShown!) {
                this.refreshData();
            } else {
                this.setState({
                    weather: this.state.weather.slice(0, this.props.daysShown!),
                });
            }
        }
    }

    refreshData() {
        const daily = [
            "temperature_2m_max",
            "temperature_2m_min",
            "weathercode",
        ];
        const url = "https://api.open-meteo.com/v1/forecast?";
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (this.props.daysShown! - 1));
        const fullUrl = url + [
            `latitude=${52.52}`,
            `longitude=${13.41}`,
            `daily=${daily.join(",")}`,
            `start_date=${dateFormat(startDate, "yyyy-mm-dd")}`,
            `end_date=${dateFormat(endDate, "yyyy-mm-dd")}`,
            `timezone=${timezone}`,
        ].join("&");
        fetch(fullUrl)
            .then((response) => response.json())
            .then((data) => {
                if(data.error) {
                    console.error(data.error);
                    return;
                }
                const weather: WeatherDay[] = [];
                for (const index in data.daily.time) {
                    const maxTemp = data.daily.temperature_2m_max[index];
                    const minTemp = data.daily.temperature_2m_min[index];
                    const weatherCode = data.daily.weathercode[index];
                    const dateString = data.daily.time[index];
                    const dateSplit = dateString.split("-");
                    const date = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1]) - 1, parseInt(dateSplit[2]));
                    weather.push({
                        date,
                        maxTemp,
                        minTemp,
                        weatherCode,
                    });
                }
                this.setState({ weather: weather });
            });
    }

    renderWeatherCode(index: number) {
        const iconSize = "0.8em";
        switch (this.state.weather[index]!.weatherCode) {
            case 0:
                return <span title="Clear"><BsSunFill size={iconSize}/></span>
            case 1:
                return <span title="Lightly cloudy"><BsCloudSunFill size={iconSize}/></span>
            case 2:
                return <span title="Cloudy"><BsCloudFill size={iconSize}/></span>
            case 3:
                return <span title="Overcast"><BsCloudsFill size={iconSize}/></span>
            case 45:
                return <span title="Foggy"><BsCloudHazeFill size={iconSize}/></span>
            case 48:
                return <span title="Depositing rime fog"><BsCloudHazeFill size={iconSize}/></span>
            case 51:
                return <span title="Light drizzle"><BsCloudDrizzleFill size={iconSize}/></span>
            case 53:
                return <span title="Drizzle"><BsCloudDrizzleFill size={iconSize}/></span>
            case 55:
                return <span title="Heavy drizzle"><BsCloudDrizzleFill size={iconSize}/></span>
            case 56:
                return <span title="Snow and drizzle"><BsCloudSleetFill size={iconSize}/></span>
            case 57:
                return <span title="Heavy snow and drizzle"><BsCloudSleetFill size={iconSize}/></span>
            case 61:
                return <span title="Light rain"><BsCloudRainFill size={iconSize}/></span>
            case 63:
                return <span title="Rain"><BsCloudRainFill size={iconSize}/></span>
            case 65:
                return <span title="Heavy rain"><BsCloudRainHeavyFill size={iconSize}/></span>
            case 66:
                return <span title="Snow and rain"><BsCloudSleetFill size={iconSize}/></span>
            case 67:
                return <span title="Heavy snow and rain"><BsCloudSleetFill size={iconSize}/></span>
            case 71:
                return <span title="Light snow"><BsCloudSnowFill size={iconSize}/></span>
            case 73:
                return <span title="Snow"><BsCloudSnowFill size={iconSize}/></span>
            case 75:
                return <span title="Heavy snow"><BsCloudSnowFill size={iconSize}/></span>
            case 77:
                return <span title="Hail and snow"><BsCloudHailFill size={iconSize}/></span>
            case 80:
                return <span title="Light rain showers"><BsCloudDrizzleFill size={iconSize}/></span>
            case 81:
                return <span title="Rain showers"><BsCloudRainFill size={iconSize}/></span>
            case 82:
                return <span title="Heavy rain showers"><BsCloudRainHeavyFill size={iconSize}/></span>
            case 85:
                return <span title="Light snow showers"><BsCloudSnowFill size={iconSize}/></span>
            case 86:
                return <span title="Heavy snow showers"><BsCloudSnowFill size={iconSize}/></span>
            case 95:
                return <span title="Thunderstorm"><BsCloudLightningFill size={iconSize}/></span>
            case 96:
                return <span title="Thunderstorm with rain"><BsCloudLightningRainFill size={iconSize}/></span>
            case 99:
                return <span title="Hailstorm"><BsCloudHailFill size={iconSize}/></span>
            default:
                return <div></div>;
        }
    }

    handleClickDay(event: React.MouseEvent<HTMLDivElement>, index: number) {
        if (this.state.showDetails === index) {
            this.setState({ showDetails: null });
        } else {
            this.setState({ showDetails: index });
        }
    }

    getTempInUnit(celsius: number) {
        return this.props.temperatureUnit === "celsius" ? celsius : celsius * 9 / 5 + 32;
    }
    renderTemperature(celsius: number) {
        const unit = this.props.temperatureUnit === "celsius" ? "°C" : "°F";
        const value = this.props.temperatureUnit === "celsius" ? celsius : celsius * 9 / 5 + 32;
        return <span>{value.toFixed(1)}{unit}</span>
    }

    render() {
        const padMaxTemp = (day: WeatherDay) => this.getTempInUnit(day.maxTemp) >= 0 && this.getTempInUnit(day.minTemp) < 0
        const padMinTemp = (day: WeatherDay) => this.getTempInUnit(day.minTemp) >= 0 && this.getTempInUnit(day.maxTemp) < 0
        const tempPadding = <span style={{color:"transparent"}}>-</span>
        return (
            <div className="w-full h-full flex flex-row content-center justify-around">
                {this.state.weather.map((day: WeatherDay, index: number) => {
                    return <div
                        className="flex flex-col content-center justify-center"
                        key={day.date.toString()}
                        onClick={(event) => this.handleClickDay(event, index)}
                    >
                        {this.props.dailyShowWeatherCode
                            ? <div>{this.renderWeatherCode(index)}</div>
                            : null
                        }
                        <div className="text-xs">
                            {index === 0
                                ? <span>Today</span>
                                : <span>{dateFormat(day.date, this.props.dayNameFormat! == "short" ? "ddd" : "dddd")}</span>
                            }
                        </div>
                        <div>
                            {this.props.dailyShowMaxTemp
                                ? <div className="text-xs">
                                    {padMaxTemp(day) && tempPadding}{this.renderTemperature(day.maxTemp)}
                                </div>
                                : null
                            }
                            {this.props.dailyShowMinTemp
                                ? <div className="text-xs">
                                    {padMinTemp(day) && tempPadding}{this.renderTemperature(day.minTemp)}
                                </div>
                                : null
                            }
                        </div>
                    </div>
                })}
            </div>
        )
    }
}