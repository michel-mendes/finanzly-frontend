import { PropsWithChildren } from "react"

import styles from "./styles.module.css"

function PageHeaderDesktop({ children }: PropsWithChildren) {
  return (
    <div className={styles.header}>
      {children}
    </div>
  )
}

export { PageHeaderDesktop }