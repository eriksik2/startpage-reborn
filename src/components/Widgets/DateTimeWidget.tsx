import React from "react";
import dateFormat from "dateformat";
import { editableBoolean } from "widgets/WidgetDescriptor";


type DateTimeWidgetState = {
  date: Date;
}

type DateTimeWidgetProps = {
  showTime: boolean;
  showDayOfWeek: boolean;
  showDate: boolean;
  showYear: boolean;
}

export class DateTimeWidget extends React.Component<DateTimeWidgetProps, DateTimeWidgetState> {
  static defaultProps = {
    showTime: true,
    showDayOfWeek: true,
    showDate: true,
    showYear: true,
  };

  static editablePropTypes = {
    showTime: editableBoolean({
      displayName: "Show time",
    }),
    showDayOfWeek: editableBoolean({
      displayName: "Show day of week",
    }),
    showDate: editableBoolean({
      displayName: "Show date",
    }),
    showYear: editableBoolean({
      displayName: "Show year",
    }),
  };

  constructor(props: DateTimeWidgetProps) {
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
    let dateParts: string[] = [];
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
