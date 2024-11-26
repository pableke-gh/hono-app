
import { Layout } from "./Main";

export const Error404 = (props: any) => {
    //TODO: error 404 not found
    return (
        <Layout msgs={props.msgs}>
            <div>Error 404: Resource not found</div>
        </Layout>
    );
}

export const Error500 = (props: any) => {
    //TODO: error 500 internal server error
    return (
        <Layout msgs={props.msgs}>
            <div>Error 500: Internal server error</div>
        </Layout>
    );
}
