
export type ItemType = {
    label: string;
    value: string;
}

export type AlertType = {
    type: string;
    icon?: string;
    children: (string | JSX.Element | JSX.Element)[];
}

export type TabType = {
    id: string;
    title: string;
    active?: boolean;
    children: JSX.Element | JSX.Element[];
}
