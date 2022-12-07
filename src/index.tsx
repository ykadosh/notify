import styles from './Notify.module.css'

interface Props {
    prop1: string
    prop2: number
}

export const MyCoolComponent = ({ prop1, prop2 }: Props) => {
    return (
        <div className={styles.notify}>Hiii {prop1} {prop2}</div>
    )
}