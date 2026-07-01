export type Stat = {
    label: string;
    value: React.ReactNode;
};

export function stat(label: string, value: React.ReactNode): Stat {
    return { label, value };
}