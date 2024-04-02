import { KeyManager } from "./KeyManager";


export const Header = () => {
    return(
        <header className="absolute inset-x-0 top-0 p-4 z-10 flex justify-end">
            <KeyManager/>
        </header>
    )
}