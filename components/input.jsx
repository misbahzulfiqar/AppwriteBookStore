import React, { useId, useState } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId()
    const [showPassword, setShowPassword] = useState(false)

    // Determine actual input type
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type

    return (
        <div className='w-full relative text-start'>
            {label && (
                <label className='inline-block mb-1 pl-1' htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                type={inputType}
                className={`px-3 py-2 rounded-lg bg-white outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
            {type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-14 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? "🚫" : "👁️"}
                </button>
            )}
        </div>
    )
})

export default Input