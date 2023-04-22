import style from "./styles.module.css"

function LoadingOverlay() {

    return (
      <div className={ style.overlay_loading }>
        <h2>Loading...</h2>
      </div>
    )
}

export { LoadingOverlay }