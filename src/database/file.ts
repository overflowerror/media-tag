import {FileTypeFromExtension, MediaFileType} from "./file-type";
import {KEY_FILE_PATH, KEY_FILE_TAGS} from "./config-keys";

export class MediaFile {
    private readonly path: string
    private readonly type: MediaFileType
    private tags: string[]

    constructor(path: string) {
        this.path = path
        this.type = FileTypeFromExtension(path)
    }

    public getPath(): string {
        return this.path
    }

    public getType(): MediaFileType {
        return this.type
    }

    public getTags(): string[] {
        return this.tags
    }

    public addTag(tag: string) {
        if (this.tags.indexOf(tag) < 0) {
            this.tags.push(tag)
        }
    }

    public removeTag(tag: string) {
        const i = this.tags.indexOf(tag)
        if (i >= 0) {
            this.tags.slice(i, 1)
        }
    }

    public hasTag(tag: string): boolean {
        return this.tags.indexOf(tag) >= 0
    }


    static fromRaw(obj: any): MediaFile {
        if (typeof obj[KEY_FILE_PATH] != "string") {
            throw "path attribute has to be string"
        }

        const file = new MediaFile(obj[KEY_FILE_PATH])

        if (!obj[KEY_FILE_TAGS]) {
            throw "tags attribute missing"
        }
        file.tags = obj[KEY_FILE_TAGS].map((t: any) => {
            if (typeof t != "string") {
                throw "tags have to be strings"
            }
            return t
        })

        return file
    }

    public toRaw(): any {
        const obj = {}

        // @ts-ignore
        obj[KEY_FILE_PATH] = this.path
        // @ts-ignore
        obj[KEY_FILE_TAGS] = this.tags

        return obj
    }
}