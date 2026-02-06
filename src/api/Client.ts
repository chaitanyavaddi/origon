

class ModuleNotImplementedException extends Error {
    constructor() {
        super("API Module not implemented.");
        this.name = "ModuleNotImplementedException";
        Object.setPrototypeOf(this, ModuleNotImplementedException.prototype);
    }
}