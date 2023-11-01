// Exceute this decorator on every decorated function call
export function decorateCustomHookFunction<F extends (...args: any[]) => Promise<any>>(func: F, setLoading: (isLoading: boolean) => void): F {
    
    // Before the function call sets the loading state "true"
    // After the function conclusion sets the loading state "false"
    return ( async (...args: Parameters<F>) => {
        setLoading(true)

        return func(...args).finally(() => {
            setLoading(false)
        })
    }) as unknown as F

}