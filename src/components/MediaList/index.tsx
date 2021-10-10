import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import MediaListItem from "../MediaListItem";

export type MediaListProps = {
    basePath: string,
    files: MediaFile[],
    onSelect: (file: MediaFile) => void
}

const MediaList: FunctionComponent<MediaListProps> = ({basePath, files, onSelect}) => {
    return (
        <div>
            {
                files.map(f => (
                    <MediaListItem key={f.getPath()} basePath={basePath} file={f} onClick={onSelect} />
                ))
            }
        </div>
    )
}

export default MediaList