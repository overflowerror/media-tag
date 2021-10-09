import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import MediaListItem from "../MediaListItem";

export type MediaListProps = {
    basePath: string,
    files: MediaFile[]
}

const MediaList: FunctionComponent<MediaListProps> = ({basePath, files}) => {
    return (
        <div>
            {
                files.map(f => (
                    <MediaListItem basePath={basePath} file={f} />
                ))
            }
        </div>
    )
}

export default MediaList