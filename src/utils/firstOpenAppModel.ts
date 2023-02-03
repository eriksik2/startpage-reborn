import { DateTimeWidget } from 'components/Widgets/DateTimeWidget';
import { LinksWidget } from 'components/Widgets/LinksWidget';
import { QuoteWidget } from 'components/Widgets/QuoteWidget';
import { WeatherWidget } from 'components/Widgets/WeatherWidget';
import { AppModel } from 'DataModel/AppModel';
import { GridBoardModel } from 'DataModel/GridBoardModel';
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';


export function firstOpenAppModel() {
    const boardModel1 = new GridBoardModel(6, 10);
    boardModel1.addWidget(new WidgetDescriptor(LinksWidget, {
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "Reddit", url: "https://reddit.com" },
      ],
    }), { row: 0, col: 4, width: 2, height: 2 })
    boardModel1.addWidget(new WidgetDescriptor(DateTimeWidget, {
      showTime: false,
      showYear: false,
      showDayOfWeek: false,
    }), { row: 2, col: 0, width: 2, height: 2 });
    boardModel1.addWidget(new WidgetDescriptor(DateTimeWidget, {
      showYear: false,
      showDate: false,
    }), { row: 2, col: 4, width: 2, height: 2 });
    boardModel1.addWidget(new WidgetDescriptor(DateTimeWidget, {
      showTime: false,
      showDayOfWeek: false,
      showDate: false,
    }), { row: 2, col: 8, width: 2, height: 2 });
    boardModel1.addWidget(new WidgetDescriptor(QuoteWidget, {}), {
      row: 5, col: 4, width: 2, height: 1
    });

    const boardModel2 = new GridBoardModel(5, 5);
    boardModel2.addWidget(new WidgetDescriptor(LinksWidget, {
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "Reddit", url: "https://reddit.com" },
      ],
    }), { row: 2, col: 0, width: 1, height: 1 });
    boardModel2.addWidget(new WidgetDescriptor(LinksWidget, {
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "Reddit", url: "https://reddit.com" },
      ],
    }), { row: 2, col: 4, width: 1, height: 1 });
    boardModel2.addWidget(new WidgetDescriptor(WeatherWidget, {
      daysShown: 5,
    }), { row: 4, col: 1, width: 3, height: 1 });
    boardModel2.addWidget(new WidgetDescriptor(QuoteWidget, {
    }), { row: 1, col: 2, width: 1, height: 2 });

    const appModel = new AppModel();
    appModel.addBoard(boardModel1);
    appModel.addBoard(boardModel2);
    return appModel;
}