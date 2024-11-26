
import { raw } from "hono/html";
import { InputType, AutocompleteType, SelectType, SelectItemType, SelectOptionType, FileType } from "../types/Inputs";
import util from "../lib/util.js";

export const InputText = (props: InputType) => {
    const id = props.id || props.name; // Default input id
    const cssLabel = "label" + (props.required ? " required" : ""); // Required indicator
    const icon = props.icon ? <i class={props.icon}></i> : null; // Default icon
    return (
        <label class="ui-block-xl ui-icon-block">
            <div class={cssLabel}>{props.label}:</div>{icon}
            <input type={props.type || "text"} id={id} name={props.name} value={props.value}
                class="ui-input" readonly={props.readonly} disabled={props.disabled}
                tabindex={props.tabindex} placeholder={props.placeholder} title={props.title} />
            <div class="ui-errtip"></div>
        </label>
    );
}
export const InputEmail = (props: InputType) => {
    props.icon = "far fa-envelope ui-input-icon right";
    return (<InputText {...props} />);
}
export const InputPass = (props: InputType) => {
    props.required = true;
    props.type = "password";
    props.placeholder = "**********";
    props.icon = "fas fa-lock ui-input-icon right";
    return (<InputText {...props} />);
}
export const InputFile = (props: FileType) => {
    const id = props.id || props.name; // Default input id
    const accept = props.accept || "*"; // Default type files to upload
    const cssLabel = "label" + (props.required ? " required" : ""); // Required indicator
    return (
        <label class="ui-block-xl">
            <div class={cssLabel}>{props.label}:</div>
            <input type="file" id={id} name={props.name} class="ui-file" 
                tabindex={props.tabindex} multiple={props.multiple} accept={accept} title={props.title} />
            <div class="ui-errtip"></div>
        </label>
    );
}
export const InputImage = (props: InputType) => {
    const id = props.id || props.name; // Default input id
    const src = props.value ? util.getUrlThumb(props.value) : util.getUrlImage("user_config.png");
    const style = "background-image:url('" + src + "');";
    return (
        <label class="ui-block-img" style={style}>
            <input type="file" id={id} name={props.name} accept="image/*" class="ui-file hide"/>
        </label>
    );
}

export const Autocomplete = (props: AutocompleteType) => {
    const id = props.id || props.name; // Default input id
    const acId = props.acId || ("ac-" + id); // Input search not to send in request
    const cssLabel = "label" + (props.required ? " required" : ""); // Required indicator
    return (
        <label class="ui-block-xl autocomplete">
            <div class={cssLabel}>{props.label}:</div>
            <i class={props.icon || "fas fa-search ui-input-icon left"}></i>
            <input type="search" id={acId} value={props.acValue} class="ui-input ui-autocomplete" 
                readonly={props.readonly} disabled={props.disabled} 
                tabindex={props.tabindex} placeholder={props.placeholder} title={props.title} />
            <input type="hidden" id={id} name={props.name} value={props.value} />
            <ul class="results"></ul>
            <div class="ui-errtip"></div>
        </label>
    );
}

const Select = (props: SelectType) => {
    const id = props.id || props.name; // Default input id
    const cssLabel = "label" + (props.required ? " required" : ""); // Required indicator
    return (
        <label class="ui-block">
            <div class={cssLabel}>{props.label}:</div>
            <select id={id} name={props.name} value={props.value} class="ui-input ui-select" tabindex={props.tabindex} 
                    readonly={props.readonly} disabled={props.disabled} title={props.title}>
                {raw(props.emptyOption)}{raw(props.options)}
            </select>
        </label>
    );
}
export const SelectItems = (props: SelectItemType) => {
    props.options = props.values.map(item => `<option value="${item.value}">${item.label}</option>`);
    return (<Select {...props} />);
}
export const SelectOptions = (props: SelectOptionType) => {
    const values = props.values || [];
    const fnDefault = (i: number) => i;
    const fnValue = (i: number) => values[i];
    const fn = props.values ? fnValue : fnDefault;
    props.options = props.labels.map((label, i) => `<option value="${fn(i)}">${label}</option>`);
    return (<Select {...props} />);
}

export const InputFloat = (props: InputType) => {
    const id = props.id || props.name; // Default input id
    const cssLabel = "label" + (props.required ? " required" : ""); // Required indicator
    const icon = props.icon ? <i class={props.icon}></i> : null; // Default icon
    return (
        <label class="ui-block ui-icon-block">
            <div class={cssLabel}>{props.label}:</div>{icon}
            <input type="text" id={id} name={props.name} value={props.value} maxlength="12" 
                class="ui-input ui-float" readonly={props.readonly} disabled={props.disabled}
                tabindex={props.tabindex} placeholder={props.placeholder} title={props.title} />
            <div class="ui-errtip"></div>
        </label>
    );
}
export const InputCurrency = (props: InputType) => {
    props.icon = props.icon || "fas fa-euro-sign ui-input-icon right";
    return (<InputFloat {...props} />);
}
export const InputFloatRange = (props: InputType) => {
    const id = props.id || props.name; // Default input id
    return (
        <label class="ui-block">
            <div class="label">{props.label}:</div>
            <input type="text" id={id + "1"} name={props.name + "1"} class="ui-input ui-float" tabindex={props.tabindex} title={props.title} />...
            <input type="text" id={id + "2"} name={props.name + "2"} class="ui-input ui-float" tabindex={props.tabindex} title={props.title} />
            <div class="ui-errtip"></div>
        </label>
    );
}

export const InputDate = (props: InputType) => {
    const id = props.id || props.name; // Default input id
    const cssLabel = "label" + (props.required ? " required" : ""); // Required indicator
    return (
        <label class="ui-block">
            <div class={cssLabel}>{props.label}:</div>
            <input type="date" id={id} name={props.name} value={props.value} class="ui-input ui-date" 
                readonly={props.readonly} disabled={props.disabled} tabindex={props.tabindex} title={props.title} />
            <div class="ui-errtip"></div>
        </label>
    );
}
export const InputDateRange = (props: InputType) => {
    const id = props.id || props.name; // Default input id
    return (
        <label class="ui-block">
            <div class="label">{props.label}:</div>
            <input type="date" id={id + "1"} name={props.name + "1"} class="ui-input ui-date" tabindex={props.tabindex} title={props.title} />...
            <input type="date" id={id + "2"} name={props.name + "2"} class="ui-input ui-date" tabindex={props.tabindex} title={props.title} />
            <div class="ui-errtip"></div>
        </label>
    );
}
