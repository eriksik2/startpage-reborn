import React from "react";
import { EditableWidgetType, WidgetDescriptor } from "widgets/WidgetDescriptor";
import { DateTimeComponent } from "./DateTimeComponent";
import { DropDownSection } from "./DropDownSection";
import { EditSidebar } from "./EditSidebar";
import { QuoteComponent } from "./QuoteComponent";
import { Widget } from "./Widget";
import { WidgetSettingsEdit } from "./WidgetSettingsEdit";


type PositionedStartpart<P extends EditableWidgetType<any>> = {
  item: WidgetDescriptor<P>;
  width: number;
  height: number;
}

type AppState = {
  widgets: WidgetDescriptor<any>[];
  grid: (PositionedStartpart<any> | null)[][];
  mode: "edit" | "view";
  selected: { col: number, row: number} | null;
  sidebarWidth: number;
};

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    const grid = Array(3).fill(null).map(() => Array(5).fill(null));
    grid[1][0] = {
      item: new WidgetDescriptor(DateTimeComponent, {
        showTime: false,
        showYear: false,
        showDayOfWeek: false,
      }),
      width: 1,
      height: 1,
    };
    grid[1][2] = {
      item: new WidgetDescriptor(DateTimeComponent, {
        showYear: false,
        showDate: false,
      }),
      width: 1,
      height: 1,
    };
    grid[1][4] = {
      item: new WidgetDescriptor(DateTimeComponent, {
        showTime: false,
        showDayOfWeek: false,
        showDate: false,
      }),
      width: 1,
      height: 1,
    };
    grid[2][2] = {
      item: new WidgetDescriptor(QuoteComponent, {
        useCustomQuote: true,
        customQuote: "Never let your dreams be dreams.",
        customAuthor: "Sun Tzu",
      }),
      width: 1,
      height: 1,
    };
    this.state = {
      widgets: [
        new WidgetDescriptor(DateTimeComponent, {}),
        new WidgetDescriptor(QuoteComponent, {}),
      ],
      grid: grid,
      mode: "view",
      selected: null,
      sidebarWidth: 100,
    };

    this.handleSwapMode = this.handleSwapMode.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleChangeSelected = this.handleChangeSelected.bind(this);
  }

  handleSwapMode() {
    this.setState({
      mode: this.state.mode == 'edit' ? 'view' : 'edit'
    });
  }

  handleSelect(col: number, row: number) {
    if(this.state.mode == 'view') return;
    if(this.state.selected?.col == col && this.state.selected?.row == row) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: { col, row } });
    }
  }

  handleDragStart(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    if(this.state.grid[col][row] == null) return;
    const text = this.state.grid[col][row]!.item.toJson();
    event.dataTransfer.setData("text/plain", text);
  }

  handleDragEnd(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    if(event.dataTransfer.dropEffect == 'none') return;

    const grid = this.state.grid;
    grid[col][row] = null;
    this.setState({
      grid
    });
  }

  handleDrop(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    const data = WidgetDescriptor.fromJson(event.dataTransfer.getData("text/plain"));;
    const grid = this.state.grid;
    grid[col][row] = {
      item: data,
      width: 1,
      height: 1,
    };
    this.setState({ grid });
  }

  handleChangeSelected(data: WidgetDescriptor<any>) {
    if(this.state.selected == null) return;
    const grid = this.state.grid;
    grid[this.state.selected.col][this.state.selected.row] = {
      item: data,
      width: 1,
      height: 1,
    };
    this.setState({ grid });
  }

  renderPart(col: number, row: number) {
    const startpart = this.state.grid[col][row];
    if(startpart == null) {
      return this.renderEmptyPart(col, row);
    }
    const { item, width, height } = startpart;
    let className = `col-span-${width} col-start-${col} row-span-${height} row-start-${row}`;
    if(this.state.mode == 'edit' && this.state.selected?.col == col && this.state.selected?.row == row) {
      className += " border-2 border-slate-300";
    }
    return <div
      draggable={this.state.mode == 'edit'}
      className={className}
      key={`${col}-${row}`}
      onClick={() => this.handleSelect(col, row)}
      onDragStart={(e) => this.handleDragStart(e, col, row)}
      onDragEnd={(e) => this.handleDragEnd(e, col, row)}
      onDrop={(e) => this.handleDrop(e, col, row)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
    >
        {item.buildWidget()}
    </div>
  }

  renderEmptyPart(col: number, row: number) {
    return <div>
      {/** Empty part */}
      {this.state.mode == 'edit'
        ? <div
            className="w-full h-full flex items-center justify-center border-2 border-slate-200"
            key={`${col}-${row}`}
            onDrop={(e) => this.handleDrop(e, col, row)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
        >+</div>
        : <div key={`${col}-${row}`}></div>
      }
    </div>
  }

  getSelected() {
    if(this.state.selected == null) return null;
    return this.state.grid[this.state.selected.col][this.state.selected.row];
  }

  render() {
    return (
      <div className="h-full">
        <div>
          {/** Header */}
          <button onClick={this.handleSwapMode}>
            {this.state.mode == 'edit'
              ? "View"
              : "Edit"}
          </button>
        </div>
        <div className="flex flex-row items-center h-full">
          {/** Main content and sidebar */}
          <div className={`
            grid grid-cols-5 grid-rows-3 w-full aspect-[16/8]
            ${this.state.mode == 'edit'
              ? "rounded border-2 border-slate-200"
              : ""
            }
          `}>
            {this.state.grid.map((column, coli) => column.map((item, rowi) => this.renderPart(coli, rowi)))}
          </div>
          <EditSidebar
            mode={this.state.mode == 'edit' ? 'opened' : 'closed'}
          >
            {/** Sidebar content */}
            <DropDownSection title="Selected">
              {this.getSelected() != null
                ? <WidgetSettingsEdit
                  data={this.getSelected()!.item}
                  onChange={this.handleChangeSelected}/>
                : <div>Nothing selected</div>
              }
            </DropDownSection>
            <DropDownSection title="Widgets">
              {this.state.widgets.map((widget, index) => (
                <div key={index}>
                  <Widget data={widget}/>
                </div>
              ))}
            </DropDownSection>
          </EditSidebar>
        </div>
      </div>
    );
  }
}