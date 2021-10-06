class Directory {
    private readonly path: string

    constructor(path: string) {
        this.path = path
    }

    public getPath(): string {
        return this.path
    }

    static fromRaw(obj: any): Directory {
        if (typeof obj != "string") {
            throw "directory has to be string"
        }

        return new Directory(obj)
    }

    public toRaw(): any {
        return this.path
    }
}