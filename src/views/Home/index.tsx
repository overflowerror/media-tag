import React, {FunctionComponent, useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import MediaList from "../../components/MediaList";
import {MediaFile} from "../../database/file";
import {useRepository} from "../../components/RepositoryProvider";
import {Query} from "../../database/query";
import {Database} from "../../database/database";

export type HomeProps = {
}

function queryFilter(query: Query, tags: string[]): Query {
    tags.forEach(t => {
        query = query.has(t)
    })
    return query
}

const Home: FunctionComponent<HomeProps> = () => {
    const repository = useRepository()

    const [tags, setTags] = useState<string[]>([])
    const [selected, setSelected] = useState<MediaFile|null>(null)

    const [database, setDatabase] = useState<Database|null>(null)

    const [error, setError] = useState<string|null>("Loading...")

    useEffect(() => {
        if (repository) {
            repository.get()
                .then(d => {
                    setError(null)
                    setDatabase(d)
                })
                .catch(e => {
                    setError(e)
                })
        } else {
            setError("no repository selected")
        }
    }, [repository])

    const query = database ? queryFilter(database.query(), tags) : new Query([])

    return (
        <div>
            { error &&
                <div className="message">
                    {error}
                </div>
            }
            { !error &&
                <>
                    <Sidebar countedTags={query.countedTags()} />
                    { selected &&
                        <></>
                    }
                    { !selected &&
                        <MediaList />
                    }
                </>
            }
        </div>
    )
}

export default Home