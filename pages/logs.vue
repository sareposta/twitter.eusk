<template>
	<div>
		<main class="content flex-1 overflow-x-hidden">
			<div class="container mx-auto px-6 py-8">
				<h3 class="text-gray-700 text-3xl font-semibold">Histórico</h3>

				<content-placeholders :rounded="true" v-if="rows.length < 1 && !loaded">
					<content-placeholders-heading :img="true" />
					<content-placeholders-text :lines="3" />
				</content-placeholders>

				<i-datatable
					:pagination="pagination"
					v-if="rows.length > 0 || loaded"
					:striped="true"
					:columns="columns"
					:i18n="i18n"
					:rows="rows"
				>
					<template v-slot:row="{ row, index }">
						<td align="right">{{ index + 1 }}</td>
						<td>
							<b>{{ row.user }}</b>
						</td>
						<td>{{ row.tweet }}</td>
						<td>{{ row.listener }}</td>
						<td>{{ row.collection }}</td>
						<td>{{ getDate(row) }}</td>
						<td>
							<i-button @click="goTo(row)" size="sm" class="ml-5 mr-2" variant="success"
								>Ir al tweet</i-button
							>
						</td>
					</template>
				</i-datatable>
			</div>
		</main>
	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
	mounted() {
		this.getData();
	},
	auth: true,
	methods: {
		getDate() {
			return moment().format('DD MM YYYY hh:mm:ss');
		},
		async confirm() {
			var id = this.row._id;
			var response = null;
			try {
				response = await axios.post('/api/listener/remove', {
					id,
				});
			} catch (error) {
				console.log('error', error);
			}

			this.row = null;
			this.visibleDeleteModal = false;
			this.getData();
		},
		goTo(row) {
			window.open('https://twitter.com/' + row.user + '/status/' + row.tweet_id, '_blank');
		},
		deleteRow(row) {
			this.row = row;
			this.visibleDeleteModal = true;
		},
		async getData() {
			try {
				var data = await axios.get('/api/tweets/list');

				this.loaded = true;
				this.rows = data.data;
			} catch (error) {
				console.log(error);
			}
		},
	},
	data() {
		return {
			loaded: false,
			row: null,
			visibleDeleteModal: false,
			i18n: {
				pagination: {
					rowsPerPage: 'Mostrando {rowsPerPage}',
					rowsRange: 'Mostrando {rowsTo} de {rowsCount}',
				},
				filtering: {
					inputPlaceholder: 'Buscar',
					noResultsFound: 'No se encuentran registros',
				},
			},
			pagination: {
				limit: { xs: 3, sm: 5 },
				size: 'md',
				variant: 'light',
				rowsFrom: 0,
				rowsPerPage: 5,
				rowsPerPageOptions: [5, 10, 25, 50, 100],
			},
			columns: [
				{ title: 'Usuario', path: 'user' },
				{ title: 'Tweet', path: 'tweet' },
				{ title: 'Escuchador', path: 'listener' },
				{ title: 'Coleccion', path: 'collection' },
				{ title: 'Fecha', path: 'date' },
				{ title: 'Opciones', path: 'options' },
			],
			rows: [],
		};
	},
};
</script>

<style>
.form-input {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background-color: transparent !important;
	border: 0px;
	padding: 10px;
}
button {
	font-weight: bold !important;
}
</style>
