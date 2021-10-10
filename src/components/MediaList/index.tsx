import React, {FunctionComponent, useEffect, useState} from "react";
import {MediaFile} from "../../database/file";
import MediaListItem from "../MediaListItem";
import {Query} from "../../database/query";
import PageControl from "../PageControl";

const pageLimit = 10

export type MediaListProps = {
    basePath: string,
    query: Query,
    onSelect: (file: MediaFile) => void
}

const MediaList: FunctionComponent<MediaListProps> = ({basePath, query, onSelect}) => {
    const [size, setSize] = useState<number>(0)
    const [page, setPage] = useState<number>(0)

    useEffect(() => {
        if (size != query.count()) {
            setSize(query.count())
            setPage(0)
        }
    }, [query])

    const files = query.limit(pageLimit, page * pageLimit).get()
    const maxPage = Math.floor((size - 1) / pageLimit)

    return (
        <div>
            { size > 0 &&
                <>
                    <PageControl current={page} max={maxPage} onChange={setPage} />
                    {
                        files.map(f => (
                            <MediaListItem key={f.getPath()} basePath={basePath} file={f} onClick={onSelect}/>
                        ))
                    }
                    <PageControl current={page} max={maxPage} onChange={setPage} />
                </>
            }
        </div>
    )
}

export default MediaList