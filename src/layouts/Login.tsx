
import { Layout } from "./Main";
import { Tab } from "../components/Tabs";
import { InputText, InputPass } from "../components/Inputs";
import { ButtonSubmit } from "../components/Buttons";

export const Contact = (props: any) => {
    // TODO tab to contact mail
    return (
        <div></div>
    );
}

export const RememberTab = (props: any) => {
    // TODO tab to remember pass
    return (
        <Tab id="tab-1" active={props.active} title="Remember Form">
        <form id="remember" action="/remember" method="post">
        </form>
        </Tab>
    );
}

export const LoginTab = (props: any) => {
    const i18n = props.msgs.getLang();
    return (
        <Tab id="tab-0" active={props.active} title="Login Form">
        <form id="signin" action="/signin" method="post">
            <div class="ui-blocks">
                <InputText name="login" required={true} label={i18n.lblLogin} icon="fas fa-user ui-input-icon right" tabindex="1" placeholder="DNI, NIF or Email"/>
                <div class="ui-block-break"></div>
                <InputPass name="pass" label={i18n.lblPass} tabindex="2" />
            </div>
            <div class="navbar">
                <ButtonSubmit>Entrar</ButtonSubmit>
            </div>
        </form>
        </Tab>
    );
}

export const LoginTabs = (props: any) => {
    return (
        <>
            <LoginTab active={props.login} msgs={props.msgs} />
            <RememberTab active={props.remember} msgs={props.msgs} />
            <script id="login-js" type="module" src="/public/js/modules/web/login.js"></script>
        </>
    );
}

export const LoginActiveTab = (props: any) => { return (<LoginTabs login="active" msgs={props.msgs}/>); }
export const RememberActiveTab = (props: any) => { return (<LoginTabs remember="active" msgs={props.msgs}/>); }

export const Login = (props: any) => {
    return (<Layout msgs={props.msgs}><LoginActiveTab msgs={props.msgs}/></Layout>);
}
export const Remember = (props: any) => {
    return (<Layout msgs={props.msgs}><RememberActiveTab msgs={props.msgs}/></Layout>);
}
