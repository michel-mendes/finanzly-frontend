import { useState, cloneElement, useEffect } from "react"
import { useLoginContext } from "../../../../contexts/LoginContext"
import style from "./styles.module.css"

interface IFlipCardProps {
    frontContent: JSX.Element
    backContent: JSX.Element
}

function LoginFlipCard( { frontContent, backContent }: IFlipCardProps ) {
    const [ cardHeight, setCardHeight ] = useState<string | null>( null )
    const { loginError } = useLoginContext().props!
    const [ isFlipped, setIsFlipped ] = useState(false)

    const handleFlip = () => {
        setIsFlipped( !isFlipped )
    }

    useEffect(() => {

      if ( loginError ) {
        setCardHeight("350px")
      } else {
        setCardHeight("300px")
      }

    }, [loginError])

    const frontContentWithHandleFlipFunction  = cloneElement( frontContent, { handleFlip } )
    const backContentWithHandleFlipFunction   = cloneElement( backContent, { handleFlip } )

    return (
        <>
          <div className={ style['flip-card'] } style={ cardHeight ? { height: cardHeight } : {} }>
            <div className={ !isFlipped ? `${ style['flip-card-inner'] }` : `${ style['flip-card-inner'] } ${ style['do-flip'] }` }>
              
              <div className={ style['flip-card-front'] }>
                { frontContentWithHandleFlipFunction }
              </div>
              
              <div className={ style['flip-card-back'] }>
                { backContentWithHandleFlipFunction }
              </div>
              
            </div>
          </div>
        </>
    )
}

export { LoginFlipCard }
