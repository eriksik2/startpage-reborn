import React from "react";
import dateFormat from "dateformat";
import { editableBoolean } from "widgets/WidgetDescriptor";


type StateType = {
  date: Date;
}

type PropsType = {
  showTime: boolean;
  showDayOfWeek: boolean;
  showDate: boolean;
  showYear: boolean;
}

export class DateTimeComponent extends React.Component<PropsType, StateType> {
  static defaultProps = {
    showTime: true,
    showDayOfWeek: true,
    showDate: true,
    showYear: true,
  };

  static editablePropTypes = {
    showTime: editableBoolean(),
    showDayOfWeek: editableBoolean(),
    showDate: editableBoolean(),
    showYear: editableBoolean(),
  };

  constructor(props: PropsType) {
      super(props);
      this.state = {
          date: new Date(),
      };
  }

  componentDidMount() {
      setInterval(() => {
          this.setState({ date: new Date() });
      }, 1000);
  }

  render() {
    const showAnyDate = this.props.showDayOfWeek || this.props.showDate || this.props.showYear;
    let dateParts = [];
    if (this.props.showDayOfWeek) {
        dateParts.push(dateFormat(this.state.date, "dddd"));
    }
    if (this.props.showDate) {
        dateParts.push(dateFormat(this.state.date, "mmmm dS"));
    }
    if (this.props.showYear) {
        dateParts.push(dateFormat(this.state.date, "yyyy"));
    }
    const dateString = dateParts.join(", ");
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {this.props.showTime 
            ? <p className="text-8xl">
              {dateFormat(this.state.date, "HH:MM")}
            </p>
            : null
        }

        {showAnyDate
          ? <p className="text-2xl">
              {dateString}
          </p>
          : null
        }
      </div>
    );
  }
}
