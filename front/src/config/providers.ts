import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { firebaseAuth } from "./firebase"

const googleProvider = new GoogleAuthProvider()



export const singInWithGoogle = async () => {
    const result = await signInWithPopup(firebaseAuth, googleProvider)

    const user = result.user

    const {displayName, email} = user

    const token = await result.user.getIdToken()

    return {token, user}
}

