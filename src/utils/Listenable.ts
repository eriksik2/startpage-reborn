

export class Listenable {
    private listeners: (() => void)[] = [];

    public addListener(listener: () => void) {
        this.listeners.push(listener);
    }

    public removeListener(listener: () => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public notifyListeners() {
        this.listeners.forEach(l => l());
    }
}