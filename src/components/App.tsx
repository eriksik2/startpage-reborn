import React from "react";
import { StartpartDescriptor } from "startparts/StartpartDescriptor";
import { DateTimeComponent } from "./DateTimeComponent";
import { EditSidebar } from "./EditSidebar";


type PositionedStartpart<P extends React.ComponentType<any>> = {
  startpart: StartpartDescriptor<P>;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

type AppState = {
  startparts: PositionedStartpart<any>[];
  mode: "edit" | "view";
  selected: number | null;
  sidebarWidth: number;
};


export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      startparts: [
        {
          startpart: new StartpartDescriptor(DateTimeComponent, {}),
          row: 1,
          col: 1,
          rowSpan: 1,
          colSpan: 1,
        }
      ],
      mode: "view",
      selected: null,
      sidebarWidth: 100,
    };

    this.handleSwapMode = this.handleSwapMode.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSwapMode() {
    this.setState({ mode: this.state.mode == 'edit' ? 'view' : 'edit' });
  }

  handleSelect(index: number) {
    if(this.state.selected == index) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: index });
    }
  }

  renderPart(index: number) {
    const startpart = this.state.startparts[index];
    const { row, col, rowSpan, colSpan } = startpart;
    let className = `col-span-${colSpan} col-start-${col} row-span-${rowSpan} row-start-${row} bg-slate-200 rounded`;
    if(this.state.selected == index) {
      className += " border-2 border-slate-300";
    }
    return <div
      onClick={() => this.handleSelect(index)}
      className={className}
      key={index}
    >
        {startpart.startpart.buildStartpart()}
    </div>
  }

  renderEmptyPart() {
    return <div>
      {/** Empty part */}
      {this.state.mode == 'edit'
        ? <div>+</div>
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
            {this.state.startparts.map((startpart, index) => this.renderPart(index))}
            
          </div>
          <EditSidebar
            mode={this.state.mode == 'edit' ? 'opened' : 'closed'}
          >
            {/** Sidebar content */}
            Selected: {this.state.selected}
          </EditSidebar>
        </div>
      </div>
    );
  }
}