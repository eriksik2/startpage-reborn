import { DateTimeWidget } from 'components/Widgets/DateTimeWidget';
import { LinksWidget } from 'components/Widgets/LinksWidget';
import { QuoteWidget } from 'components/Widgets/QuoteWidget';
import { AppModel } from 'DataModel/AppModel';
import { GridBoardModel } from 'DataModel/GridBoardModel';
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';


export function firstOpenAppModel() {
    const boardModel = new GridBoardModel(6, 10);
    boardModel.addWidget(new WidgetDescriptor(LinksWidget, {
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "Reddit", url: "https://reddit.com" },
      ],
    }), { row: 0, col: 4, width: 2, height: 2 })
    boardModel.addWidget(new WidgetDescriptor(DateTimeWidget, {
      showTime: false,
      showYear: false,
      showDayOfWeek: false,
    }), { row: 2, col: 0, width: 2, height: 2 });
    boardModel.addWidget(new WidgetDescriptor(DateTimeWidget, {
      showYear: false,
      showDate: false,
    }), { row: 2, col: 4, width: 2, height: 2 });
    boardModel.addWidget(new WidgetDescriptor(DateTimeWidget, {
      showTime: false,
      showDayOfWeek: false,
      showDate: false,
    }), { row: 2, col: 8, width: 2, height: 2 });
    boardModel.addWidget(new WidgetDescriptor(QuoteWidget, {}), {
      row: 4, col: 4, width: 2, height: 2
    });

    const appModel = new AppModel();
    appModel.addBoard(boardModel);
    return appModel;
}