// Exceute this decorator on every decorated function call
export function decorateCustomHookFunction<F extends Function>(func: F, setLoading: (isLoading: boolean) => void): F {
    
    // Before the function call sets the loading state "true"
    // After the function conclusion sets the loading state "false"
    return ( (...args: any[]) => {
        setLoading(true)
        
        func(...args).finally(() => {
            setLoading(false)
        })
    }) as unknown as F

}