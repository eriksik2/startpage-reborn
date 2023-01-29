import { DateTimeComponent } from 'components/DateTimeComponent';
import { LinksComponent } from 'components/LinksComponent';
import { QuoteComponent } from 'components/QuoteComponent';
import { AppModel } from 'DataModel/AppModel';
import { GridBoardModel } from 'DataModel/GridBoardModel';
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';


export function firstOpenAppModel() {
    const boardModel = new GridBoardModel(6, 10);
    boardModel.addWidget(new WidgetDescriptor(LinksComponent, {
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "Reddit", url: "https://reddit.com" },
      ],
    }), { row: 0, col: 4, width: 2, height: 2 })
    boardModel.addWidget(new WidgetDescriptor(DateTimeComponent, {
      showTime: false,
      showYear: false,
      showDayOfWeek: false,
    }), { row: 2, col: 0, width: 2, height: 2 });
    boardModel.addWidget(new WidgetDescriptor(DateTimeComponent, {
      showYear: false,
      showDate: false,
    }), { row: 2, col: 4, width: 2, height: 2 });
    boardModel.addWidget(new WidgetDescriptor(DateTimeComponent, {
      showTime: false,
      showDayOfWeek: false,
      showDate: false,
    }), { row: 2, col: 8, width: 2, height: 2 });
    boardModel.addWidget(new WidgetDescriptor(QuoteComponent, {}), {
      row: 4, col: 4, width: 2, height: 2
    });

    const appModel = new AppModel();
    appModel.addBoard(boardModel);
    return appModel;
}