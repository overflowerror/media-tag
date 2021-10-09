import React, {FunctionComponent, useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import MediaList from "../../components/MediaList";
import {MediaFile} from "../../database/file";
import {useRepository} from "../../components/RepositoryProvider";
import {Query} from "../../database/query";
import {Database} from "../../database/database";
import MediaDetails from "../../components/MediaDetails";

export type HomeProps = {
}

function queryFilter(query: Query, tags: string[]): Query {
    tags.forEach(t => {
        query = query.has(t)
    })
    return query
}

const emptyQuery = new Query([])

const Home: FunctionComponent<HomeProps> = () => {
    const repository = useRepository()

    const [tags, setTags] = useState<string[]>([])
    const [selected, setSelected] = useState<MediaFile|null>(null)

    const [database, setDatabase] = useState<Database|null>(null)

    const [message, setMessage] = useState<string|null>("Loading...")

    useEffect(() => {
        if (repository) {
            repository.get()
                .then(d => {
                    setMessage(null)
                    setDatabase(d)
                })
                .catch(e => {
                    setMessage(e)
                })
        } else {
            setMessage("no repository selected")
        }
    }, [repository])

    const query = database ? queryFilter(database.query(), tags) : emptyQuery
    const allTags = database ? database.query().tags() : []

    const mediaUpdate = (updatedFile: MediaFile) => {
        const clone = database.clone() // not a deep copy
        clone.updateFile(updatedFile)
        repository.update(clone)
        setMessage("Saving...")

        repository.write().then(() => {
            setSelected(updatedFile)
            setDatabase(clone)
            setMessage(null)
        })
    }

    return (
        <div>
            { message &&
                <div className="message">
                    {message}
                </div>
            }
            { !message &&
                <>
                    <Sidebar countedTags={query.countedTags()} />
                    { selected &&
                        <>
                            <button onClick={() => setSelected(null)}>Back</button>
                            <MediaDetails basePath={repository.getPath()} file={selected} onUpdate={mediaUpdate} />
                        </>
                    }
                    { !selected &&
                        <MediaList basePath={repository.getPath()} files={query.get()} onSelect={setSelected} />
                    }
                </>
            }
        </div>
    )
}

export default Home