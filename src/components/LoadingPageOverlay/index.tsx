import style from "./styles.module.css"

function LoadingOverlay() {

    return (
      <div className={style.loader_container}>
        <div className={style.custom_loader}></div>
      </div>
    )
}

export { LoadingOverlay }