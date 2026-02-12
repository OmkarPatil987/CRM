import React from 'react'

const ActionButton = ({
    label,
    variant = 'outlined',
    startIcon,
    onClick,
    size = 'medium',
    color = 'default',
}: {
    label: string
    variant?: 'text' | 'outlined' | 'contained'
    startIcon?: React.ReactNode
    onClick?: () => void
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'error' | 'default'
}) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus:outline-none focus:ring-2'
    const sizeMap = {
        small: 'px-3 py-1.5 text-xs',
        medium: 'px-4 py-2 text-sm',
        large: 'px-5 py-2.5 text-sm',
    }

    const getColorClass = () => {
        if (variant === 'contained') {
            if (color === 'error') return 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-200'
            return 'bg-primary text-white shadow-sm shadow-indigo-200/60 hover:bg-primary/90 focus:ring-indigo-200'
        }
        if (variant === 'outlined') {
            if (color === 'error') return 'border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 focus:ring-red-100'
            return 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 focus:ring-slate-200'
        }
        // text
        if (color === 'error') return 'text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-100'
        return 'text-slate-600 hover:text-slate-900 focus:ring-slate-200'
    }

    const renderedIcon = React.isValidElement(startIcon)
        ? React.cloneElement(startIcon as React.ReactElement<any>, {
            className: `h-4 w-4 ${((startIcon as React.ReactElement<any>).props?.className ?? '')}`.trim(),
            fontSize: 'inherit',
        })
        : startIcon

    return (
        <button
            type="button"
            className={`${base} ${sizeMap[size]} ${getColorClass()}`}
            onClick={onClick}
        >
            {renderedIcon && <span className="text-base">{renderedIcon}</span>}
            {label}
        </button>
    )
}

export default ActionButton
