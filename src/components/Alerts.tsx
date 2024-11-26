
import { AlertType } from "../types/Components";

export const Notice = (props: AlertType) => {
    const type = `notice notice-${props.type}`;
    const icon = props.icon ? "notice-icon" : "hide";
    return (
        <div class={type}>
            <div class={icon}><i class={props.icon}></i></div>
            <div class="notice-text">{props.children}</div>
        </div>
    );
}

export const Alert = (props: AlertType) => {
    const type = `alert alert-${props.type}`;
    return (
        <div class={type}>
            <div class="alert-icon"><i class={props.icon}></i></div>
            <div class="alert-text">{props.children}</div>
            <div class="alert-close"><i class="fas fa-times"></i></div>
        </div>
    );
}

export const Alerts = (props: any) => {
    return (
        <div class="alerts">
            <Alert type="success" icon="fas fa-check-circle fa-2x">{props.msgOk}</Alert>
            <Alert type="info" icon="fas fa-info fa-2x">{props.msgInfo}</Alert>
            <Alert type="warn" icon="fas fa-exclamation-triangle fa-2x">{props.msgWarn}</Alert>
            <Alert type="error" icon="fas fa-exclamation fa-2x">{props.msgError}</Alert>
        </div>
    );
}

export const Loading = () => {
    return (
        <div class="loading">
            <b class="fas fa-circle-notch fa-3x fa-spin loading-content"></b>
        </div>
    );
}

export const BackToTop = () => {
    return (
        <a id="back-to-top" href="#top" class="hide back-to-top">
            <i class="fas fa-arrow-up"></i>
        </a>
    );
}
