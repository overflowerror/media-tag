import {KEY_DIRECTORIES, KEY_FILES} from "./config-keys";
import {Directory} from "./directory";
import {MediaFile} from "./file";
import {Query} from "./query";

export class Database {
    private directories: Directory[]
    private files: MediaFile[]

    constructor() {
    }

    public query(): Query {
        return new Query(this.files)
    }

    public addDirectory(path: string) {
        this.directories.push(new Directory(path))
    }

    public updateFile(file: MediaFile) {
        this.files = this.files.filter(f => f.getPath() != file.getPath())
        this.files.push(file)
    }

    public findUntaggedPathsInDb(): string[] {
        return this.files
            .filter(f => f.getTags().length == 0)
            .map(f => f.getPath())
    }

    public async forEachDirectory(callback: (d: string) => Promise<void>): Promise<void> {
        for (let i = 0; i < this.directories.length; i++) {
            await callback(this.directories[i].getPath())
        }
    }

    public hasFile(path: string): boolean {
        return this.files.filter(f => f.getPath() == path).length != 0
    }

    public getFile(path: string): MediaFile {
        const files = this.files.filter(f => f.getPath())

        if (files.length == 1) {
            return files[0]
        } else {
            return new MediaFile(path)
        }
    }

    public static fromRaw(obj: any): Database {
        const db = new Database()

        if (!obj[KEY_DIRECTORIES] || typeof obj[KEY_DIRECTORIES] != "object") {
            throw "directories attribute not found"
        }
        db.directories = obj[KEY_DIRECTORIES].map((d: any) => Directory.fromRaw(d))

        if (!obj[KEY_FILES] || typeof obj[KEY_FILES] != "object") {
            throw "files attribute not found"
        }
        db.files = obj[KEY_FILES].map((d: any) => MediaFile.fromRaw(d))

        return db
    }

    public toRaw(): any {
        let obj = {}

        // @ts-ignore
        obj[KEY_DIRECTORIES] = this.directories.map(d => d.toRaw())
        // @ts-ignore
        obj[KEY_FILES] = this.files.map(f => f.toRaw())

        return obj
    }
}