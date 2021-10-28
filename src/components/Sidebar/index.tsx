import React, {FunctionComponent} from "react";
import {CountedTag} from "../../database/query";
import "./Sidebar.css"

export type SidebarProps = {
    countedTags: CountedTag[],
    selected: string[],
    onSelect: (tag: string) => void
}

const Sidebar: FunctionComponent<SidebarProps> = ({countedTags, selected, onSelect}) => {
    return (
        <div className="sidebar">
            <h2>Tags</h2>
            <ul>
                {
                    countedTags.map(t => (
                        <li
                            key={t.name}
                            className={selected.indexOf(t.name) >= 0 ? "selected" : ""}
                            onClick={() => onSelect(t.name)}
                        >
                            {t.name} ({t.count})
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar