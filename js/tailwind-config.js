tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark Mode Colors from theme.js
                primary: {
                    DEFAULT: '#141b2d', // Dark mode background (primary 500)
                    light: '#fcfcfc',   // Light mode background
                    400: '#1F2A40',     // Dark mode component bg
                    100: '#d0d1d5',     // Dark mode text/primary
                },
                grey: {
                    100: '#e0e0e0', // Dark mode text high contrast
                    400: '#858585',
                    800: '#292929',
                },
                // Custom aliases for easy usage
                dark: {
                    bg: '#141b2d',
                    card: '#1F2A40',
                    text: '#e0e0e0',
                }
            }
        }
    }
}
