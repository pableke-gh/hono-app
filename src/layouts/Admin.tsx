
import { Layout } from "./Main";
import { Tab, TabNav0 } from "../components/Tabs";
import { InputEmail, InputImage, InputText } from "../components/Inputs";
import { ButtonSubmit } from "../components/Buttons";

export const ActionsTab = (props: any) => {
    return (
        <Tab id="tab-0" active={props.active} title="User Actions">
            <a href="#tab-1" class="tab-action">Profile</a> 
            <a href="/logout">Logout</a>
        </Tab>
    );
}

export const ProfileTab = (props: any) => {
    const user = props.user;
    return (
        <Tab id="tab-1" active={props.active} title="Profile">
        <form id="profile" action="/admin/profile" method="post" enctype="multipart/form-data">
            <input type="hidden" id="id" name="id" value={user.id} class="ui-number" />
            <div class="ui-blocks">
                <InputText name="nombre" value={user.nombre} required={true} label="Nombre" tabindex="1" placeholder="User name"/>
                <InputEmail name="email" value={user.email} required={true} label="Email" tabindex="2" placeholder="Type your Email"/>
                <div class="ui-block-break"></div>
                <InputImage name="logo" label="Logo" value={user.logo} tabindex="3" />
            </div>
            <div class="navbar">
                <TabNav0/>
                <ButtonSubmit>Guardar</ButtonSubmit>
            </div>
        </form>
        </Tab>
    );
}

export const AdminTabs = (props: any) => {
    return (
        <>
            <ActionsTab active={props.actions}/>
            <ProfileTab active={props.profile} user={props.user}/>
            <script id="admin-js" type="module" src="/public/js/modules/web/admin.js"></script>
        </>
    );
}

export const ActionsActiveTab = (props: any) => { return (<AdminTabs actions="active" user={props.user}/>); }
export const ProfileActiveTab = (props: any) => { return (<AdminTabs profile="active" user={props.user}/>); }

export const Admin = (props: any) => {
    return (<Layout {...props}><ActionsActiveTab user={props.user}/></Layout>);
}
export const Profile = (props: any) => {
    return (<Layout {...props}><ProfileActiveTab user={props.user}/></Layout>);
}
