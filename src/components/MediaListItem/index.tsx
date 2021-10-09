import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import MediaPreview from "../MediaPreview";

export type MediaListItemProps = {
    basePath: string,
    file: MediaFile,
    onClick: (file: MediaFile) => void
}

const MediaListItem: FunctionComponent<MediaListItemProps> = ({basePath, file, onClick}) => {
    return (
        <div onClick={() => onClick(file)}>
            <MediaPreview basePath={basePath} file={file} />
        </div>
    )
}

export default MediaListItem