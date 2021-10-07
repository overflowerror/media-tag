import React, {FunctionComponent} from "react";
import {CountedTag} from "../../database/query";

export type SidebarProps = {
    countedTags: CountedTag[]
}

const Sidebar: FunctionComponent<SidebarProps> = ({countedTags}) => {
    return (
        <div>
            <ul>
                {
                    countedTags.map(t => (
                        <li key={t.name}>{t.name} ({t.count})</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar