import React from "react";
import { WidgetDescriptor } from "startparts/WidgetDescriptor";
import { DateTimeComponent } from "./DateTimeComponent";
import { DropDownSection } from "./DropDownSection";
import { EditSidebar } from "./EditSidebar";
import { Widget } from "./Widget";


type PositionedStartpart<P extends React.ComponentType<any>> = {
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
    this.state = {
      widgets: [
        new WidgetDescriptor(DateTimeComponent, {}),
      ],
      grid: [
        [
          {
            item: new WidgetDescriptor(DateTimeComponent, {}),
            width: 1,
            height: 1,
          }
        ],
      ],
      mode: "view",
      selected: null,
      sidebarWidth: 100,
    };

    this.handleSwapMode = this.handleSwapMode.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleSwapMode() {
    this.setState({ mode: this.state.mode == 'edit' ? 'view' : 'edit' });
  }

  handleSelect(col: number, row: number) {
    if(this.state.selected?.col == col && this.state.selected?.row == row) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: { col, row } });
    }
  }

  handleDrop(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    const data = WidgetDescriptor.fromJson(event.dataTransfer.getData("text/plain"));;
    const grid = this.state.grid;
    grid[col][row] = {
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
    let className = `col-span-${width} col-start-${col} row-span-${height} row-start-${row} bg-slate-200 rounded`;
    if(this.state.selected?.col == col && this.state.selected?.row == row) {
      className += " border-2 border-slate-300";
    }
    return <div
      onClick={() => this.handleSelect(col, row)}
      className={className}
      key={`${col}-${row}`}
    >
        {item.buildStartpart()}
    </div>
  }

  getSelected() {
    if(this.state.selected == null) return null;
    return this.state.grid[this.state.selected.col][this.state.selected.row];
  }

  renderEmptyPart(col: number, row: number) {
    console.log(this.state.mode);
    return <div>
      {/** Empty part */}
      {this.state.mode == 'edit'
        ? <div
            className="w-full h-full bg-slate-200 rounded border-2 border-slate-200"
            onDrop={(e) => this.handleDrop(e, col, row)}
        >+</div>
        : null
      }
    </div>
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
            grid grid-cols-5 grid-rows-3 w-full aspect-video
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
            <p>Selected: {this.getSelected()?.item.componentType.name}</p>
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