import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

export const metadata = {
	title: 'Only Crypto',
	description: 'Access exclusive content from your favorite creator.',
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}
