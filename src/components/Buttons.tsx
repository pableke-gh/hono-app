
export const ButtonTheme = (props: any) => {
    return (
        <button id="theme-toggle">
            <i class="fas fa-moon hide"></i>
            <i class="fas fa-sun hide"></i>
        </button>
    );
}

export const ButtonSubmit = (props: any) => {
    return (
        <button type="submit" class="btn btn-green">{props.children}</button>
    );
}
