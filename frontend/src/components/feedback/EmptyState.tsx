type EmptyStateProps = {
    title: string;
    description: string;
};

export function EmptyState({
    title,
    description,
}: EmptyStateProps): JSX.Element {
    return (
        <section
            className='empty-state'
            aria-label={title}
        >
            <p className='empty-state__eyebrow'>Scaffold</p>
            <h2>{title}</h2>
            <p>{description}</p>
        </section>
    );
}
