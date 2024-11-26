
import { ItemType } from "./Components";

type Input = {
    label: string;
    icon?: string;
    id?: string;
    name: string;
    value?: string;
    tabindex: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    title?: string;
    placeholder?: string;
}
export interface InputType extends Input {
    type?: string;
}
export interface FileType extends Input {
    accept?: string;
    multiple?: boolean;
}
export interface AutocompleteType extends Input {
    acId?: string;
    acValue?: string;
}

export type SelectType = {
    label: string;
    id?: string;
    name: string;
    value?: string;
    emptyOption?: string;
    options: string[];
    tabindex: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    title?: string;
}
export interface SelectItemType extends SelectType {
    values: Array<ItemType>;
}
export interface SelectOptionType extends SelectType {
    labels: string[];
    values?: string[] | number[];
}
