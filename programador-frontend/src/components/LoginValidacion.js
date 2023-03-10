import { useState } from "react";

//Los valores iniciales del formulario los recibe este hook (initialForm)
export const useForm = (initialForm,validateForm) => {
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)

    const handleChange = (e) => { }

    const handleBlur = (e) => { }

    const handleSubmit = (e) => { }

    return {
        form, errors, loading, response, handleChange, handleBlur, handleSubmit
    }


}