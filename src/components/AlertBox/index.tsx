import { FaInfoCircle       }   from "react-icons/fa" //Info icon
import { AiFillCheckCircle  }   from "react-icons/ai" //Success icon
import { TiWarning          }   from "react-icons/ti" //Warning icon
import { AiFillCloseCircle  }   from "react-icons/ai" //Error icon
import { AiOutlineClose     }   from "react-icons/ai" //Close icon

import style from "./styles.module.css"

type IAlertTypes = 'info' | 'success' | 'warning' | 'error'

interface IAlertBoxProps {
    alertMessage: string
    alertType: IAlertTypes
    onCloseButtonClick?: Function
}

function AlertBox( props: IAlertBoxProps ) {
    const { alertMessage, alertType, onCloseButtonClick } = props
    const { alertClassName, alertIcon } = getAlertClassAndIcon( alertType )

    return (
        <>
            <div className={ `${ style.message_box } ${ alertClassName }` }>
                <span className={ style.alert_icon }>{ alertIcon }</span>
                <span>{ alertMessage }</span>
                
                {
                    onCloseButtonClick
                    ?
                    <span className={ style.close_button } onClick={ () => { onCloseButtonClick() } } ><AiOutlineClose></AiOutlineClose></span>
                    : null
                }

            </div>
        </>
    )
}

// Helper function
function getAlertClassAndIcon( alertType: IAlertTypes ): {alertClassName: string, alertIcon: JSX.Element} {

    switch ( alertType ) {
        case "success": {
            return {
                alertClassName: style.success_msg,
                alertIcon: <AiFillCheckCircle></AiFillCheckCircle>
            }
        }
        case "warning": {
            return {
                alertClassName: style.warning_msg,
                alertIcon: <TiWarning></TiWarning>
            }
        }
        case "error": {
            return {
                alertClassName: style.error_msg,
                alertIcon: <AiFillCloseCircle></AiFillCloseCircle>
            }
        }
        default: {
            return {
                alertClassName: style.info_msg,
                alertIcon: <FaInfoCircle></FaInfoCircle>
            }
        }
    }

}

export { AlertBox }