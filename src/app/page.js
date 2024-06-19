const fs = require('fs')

const getCreators = () => {
	const creators = fs.readFileSync('./src/app/creators.json', 'utf-8')
	return JSON.parse(creators)
}

export default async function Home() {
	let creators = getCreators()
	return (
		<main className='container text-center'>
			<div className='row'>
				<div className='main-col col d-flex flex-column justify-content-center'>
					<div id='header'>
						<h1>Only Crypto</h1>
						<p>Access exclusive content from your favorite creator.</p>
					</div>
					{creators && creators.length && creators.length > 0 ? (
						<table className='table table-bordered'>
							<thead>
								<tr>Address</tr>
								<tr>Name</tr>
								<tr>Link</tr>
							</thead>
							<tbody>
								{creators.map(creator => (
									<tr key={creator.address}>
										<td>{creator.address}</td>
										<td>{creator.name}</td>
										<td>
											<a href={`/creators/${creator.address}`}>Link</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : null}
				</div>
			</div>
		</main>
	)
}
