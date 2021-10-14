import React, {FunctionComponent} from "react";
import {MediaFile} from "../../database/file";
import {MediaFileType} from "../../database/file-type";

import "./Media.css"

export type MediaPreviewProps = {
    basePath: string,
    file: MediaFile
}

const MediaPreview: FunctionComponent<MediaPreviewProps> = ({basePath, file}) => {
    switch (file.getType()) {
        case MediaFileType.unknown:
            return (
                <div className="media">
                    unknown file type
                </div>
            )
        case MediaFileType.video:
            return (
                <div className="media">
                    videos not yet supported
                </div>
            )
        case MediaFileType.image:
            return (
                <div className="media">
                    <img src={"media://" + basePath + "/" + file.getPath()} alt={file.getPath()} />
                </div>
            )
    }
}

export default MediaPreview