import { useAppDispatch } from "../redux/reduxHooks";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { setSnackbar } from "../../redux/snackbarSlice";

interface ErrorResponse {
    [key: string]: string[]
}

export const useErrorMessage = <T extends FieldValues>() => {
    const dispatch = useAppDispatch();
    return (errRes: ErrorResponse, setError: UseFormSetError<T>, defaultMessage: string) => {
        Object.keys(errRes).map((key) => {
            const messages = errRes[`${key}`]
            let newMessages = [];

            // メッセージ内のスペースを削除
            console.log(typeof (messages))
            for (let i = 0; i < messages.length; i++) {
                newMessages[i] = messages[i].replace(/ /g, "")
            }
            // messageが文字列型の時、新しいメッセージを結合して一つの配列にする(これをしないと１文字ずつ改行される)
            if (typeof (messages) === "string") {
                newMessages = [newMessages.join("")]
            }

            if (key === "detail") {
                const snackbarMessage = '\n' + newMessages.join('\n')
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: defaultMessage + snackbarMessage
                }))
                return null
            } else {
                setError(key as Path<T>, { type: "validate", message: newMessages.join('\n') })
            }
            return null

        })
    }
}

export const useLoginErrorMessage = <T extends FieldValues>() => {
    const dispatch = useAppDispatch();
    return (errRes: ErrorResponse, setError: UseFormSetError<T>, defaultMessage: string) => {
        Object.keys(errRes).map((key) => {
            const messages = errRes[`${key}`]
            if (key === "detail") {
                const newMessages = "メールアドレスかパスワードが一致しません."
                const snackbarMessage = '\n' + newMessages
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: defaultMessage + snackbarMessage
                }))
                return null
            } else {
                const newMessages = [];
                console.log(messages)
                // メッセージ内のスペースを削除
                for (let i = 0; i < messages.length; i++) {
                    newMessages[i] = messages[i].replace(/ /g, "")
                }
                console.log(newMessages)
                setError(key as Path<T>, { type: "validate", message: newMessages.join('\n') })
            }
            return null
        })
    }
}