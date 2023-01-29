
import { Listenable } from 'utils/Listenable';
import { BoardModel } from './BoardModel';

// AppModel is the data model for the entire startpage application.
// It contains a list of boards, modeled by the BoardModel class.
export class AppModel extends Listenable {

    boards: BoardModel<any>[];

    constructor() {
        super();
        this.boards = [];
    }

    public addBoard(page: BoardModel<any>) {
        this.boards.push(page);
        this.notifyListeners();
    }

    public removeBoard(page: BoardModel<any>) {
        this.boards = this.boards.filter(p => p !== page);
        this.notifyListeners();
    }

    public moveBoard(page: BoardModel<any>, index: number) {
        const oldIndex = this.boards.indexOf(page);
        if (oldIndex >= 0) {
            this.boards.splice(oldIndex, 1);
            this.boards.splice(index, 0, page);
            this.notifyListeners();
        }
    }

}