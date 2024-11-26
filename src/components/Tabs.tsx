
import { TabType } from "../types/Components";

export const Tab = (props: TabType) => {
    const active = props.active ? "tab-content active" : "tab-content";
    return (
        <div id={props.id} class={active}>
            <h2>{props.title}<hr class="underline"/></h2>
            {props.children}
        </div>
    );
}

export const TabNavigate = (props: any) => {
    return (<a href={props.href} class="btn btn-primary">{props.children}</a>);
}
export const TabNav0 = (props: any) => {
    const icon = props.icon || "fas fa-angle-double-left"; // Default icon
    return (<TabNavigate href="#tab-0"><i class={icon}></i>{props.children}</TabNavigate>);
}
export const TabPrev = (props: any) => {
    const icon = props.icon || "fas fa-angle-double-left"; // Default icon
    return (<TabNavigate href="#next-prev"><i class={icon}></i>{props.children}</TabNavigate>);
}
export const TabNext = (props: any) => {
    const icon = props.icon || "fas fa-angle-double-right"; // Default icon
    return (<TabNavigate href="#next-tab">{props.children}<i class={icon}></i></TabNavigate>);
}
