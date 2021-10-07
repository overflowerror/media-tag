import React, {FunctionComponent, useEffect, useState} from "react";
import {useRepository} from "../RepositoryProvider";
import {CountedTag} from "../../database/query";

export type SidebarProps = {
}

const Sidebar: FunctionComponent<SidebarProps> = () => {
    const repository = useRepository()

    const [tags, setTags] = useState<CountedTag[]>([])

    useEffect(() => {
        console.log("sidebar use effect")

        if (repository) {
            repository.get().then(d => {
                console.log(d)
                setTags(d.query().countedTags())
            }).catch(console.log)
        }
    }, [repository])

    return (
        <div>
            <ul>
                {
                    tags.map(t => (
                        <li>{t.name} ({t.count})</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar